const express = require("express");
const router = express.Router();
const ApplicationForm = require("../models/ApplicationForm");
const Course = require("../models/Course");
const { auth, authorize } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "Uploads/applications";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
  fileFilter: (req, file, cb) => {
    console.log("File received:", file); // Log incoming files for debugging
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only JPEG, PNG, and PDF files are allowed"));
  },
});

// Dynamic multer middleware to set max file count based on programType
const dynamicUpload = (req, res, next) => {
  const maxFiles = req.body.programType === "UG" ? 10 : 10; // Allow up to 10 files for testing
  upload.array("documents", maxFiles)(req, res, next);
};

// Middleware to log request details
const logRequest = (req, res, next) => {
  console.log("Received files:", req.files);
  console.log("Received body:", req.body);
  next();
};

// Error handling middleware for Multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer error:", err);
    return res.status(400).json({
      message: `File upload error: ${err.message}`,
      field: err.field || "unknown",
      code: err.code,
    });
  }
  next(err);
};

// Mark comments as read
router.post(
  "/mark-comments-read/:studentId/:courseId",
  auth,
  authorize(["student"]),
  async (req, res) => {
    try {
      const { studentId, courseId } = req.params;
      const application = await ApplicationForm.findOne({ studentId, courseId });
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (application.status !== "rejected") {
        return res.status(400).json({ message: "Comments can only be marked as read for rejected applications" });
      }
      application.commentsRead = true;
      await application.save();
      res.status(200).json({ message: "Comments marked as read" });
    } catch (error) {
      console.error("Error marking comments as read:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Save draft application
router.post(
  "/save-draft",
  auth,
  authorize(["student"]),
  dynamicUpload,
  handleMulterError,
  logRequest,
  [
    body("courseId").notEmpty().withMessage("Course ID is required"),
    body("studentId").notEmpty().withMessage("Student ID is required"),
    body("formData").custom((value) => {
      try {
        JSON.parse(value);
        return true;
      } catch (e) {
        throw new Error("Form data must be a valid JSON object");
      }
    }),
    body("educationDetails").custom((value) => {
      try {
        JSON.parse(value);
        return true;
      } catch (e) {
        throw new Error("Education details must be a valid JSON object");
      }
    }),
    body("lastActiveSection").isInt({ min: 0 }).withMessage("Last active section must be a non-negative integer"),
    body("programType").isIn(["UG", "PG"]).optional().withMessage("Program type must be UG or PG"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error("Validation errors:", errors.array());
        return res.status(400).json({ message: "Validation failed", errors: errors.array() });
      }

      const { courseId, studentId, lastActiveSection, programType } = req.body;
      let formData, educationDetails;
      try {
        formData = JSON.parse(req.body.formData);
        educationDetails = JSON.parse(req.body.educationDetails);
      } catch (e) {
        console.error("JSON parsing error:", e);
        return res.status(400).json({ message: "Invalid JSON in formData or educationDetails" });
      }

      // Validate course existence
      const course = await Course.findById(courseId);
      if (!course) {
        console.error("Course not found for courseId:", courseId);
        return res.status(404).json({ message: "Course not found" });
      }

      console.log("Saving draft with status:", req.body.status);
      console.log("FormData:", formData);
      console.log("EducationDetails:", educationDetails);
      console.log("ProgramType:", programType);

      let application = await ApplicationForm.findOne({ studentId, courseId });

      if (application && application.status === "verified") {
        return res.status(400).json({ message: "Cannot save draft for verified application" });
      }

      // Merge new uploads with existing documents
      const documents = [];
      const existingDocs = application?.formData?.documents || [];
      
      console.log("Received formData.documents:", formData.documents);
      if (formData.documents && Array.isArray(formData.documents)) {
        formData.documents.forEach((doc, index) => {
          // Check for new file upload
          const file = req.files?.find(f => f.fieldname === "documents" && (!doc.originalName || f.originalname === doc.originalName));
          if (file) {
            // New file uploaded
            documents.push({
              type: doc.type,
              filename: file.filename,
              path: file.path,
              originalName: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
            });
          } else if (doc.filename && doc.path && doc.type) {
            // Preserve existing document
            const existingDoc = existingDocs.find(d => d.filename === doc.filename && d.path === doc.path && d.type === doc.type);
            if (existingDoc) {
              documents.push({
                type: doc.type,
                filename: doc.filename,
                path: doc.path,
                originalName: doc.originalName,
                mimetype: doc.mimetype,
                size: doc.size,
              });
            }
          } else if (doc.type) {
            // Document placeholder without file
            documents.push({ type: doc.type });
          }
        });
      }

      formData.documents = documents;

      // Use course.programType if programType is not provided
      const effectiveProgramType = programType || course.programType || "PG";

      if (application) {
        // Update existing application (draft or rejected)
        application.formData = formData;
        application.educationDetails = educationDetails;
        application.lastActiveSection = lastActiveSection;
        application.status = "draft";
        application.programType = effectiveProgramType;
        // Preserve fieldComments
      } else {
        // Create new application
        application = new ApplicationForm({
          courseId,
          studentId,
          formData,
          educationDetails,
          lastActiveSection,
          status: "draft",
          programType: effectiveProgramType,
        });
      }

      await application.save();
      res.status(200).json({ message: "Draft saved successfully" });
    } catch (error) {
      console.error("Error saving draft:", error);
      if (error instanceof multer.MulterError) {
        return res.status(400).json({ message: `File upload error: ${error.message}` });
      }
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map((err) => ({
          field: err.path,
          message: err.message,
        }));
        console.error("MongoDB validation errors:", validationErrors);
        return res.status(400).json({ message: "MongoDB validation error", errors: validationErrors });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Submit application (Only authenticated students)
router.post(
  "/submit-application",
  auth,
  authorize(["student"]),
  dynamicUpload,
  handleMulterError,
  logRequest,
  [
    body("courseId").notEmpty().withMessage("Course ID is required"),
    body("studentId").notEmpty().withMessage("Student ID is required"),
    body("formData").custom((value) => {
      try {
        const parsed = JSON.parse(value);
        if (!parsed.aadhaarNumber || !/^\d{12}$/.test(parsed.aadhaarNumber)) {
          throw new Error("Valid 12-digit Aadhaar number is required");
        }
        if (!parsed.email || !/\S+@\S+\.\S+/.test(parsed.email)) {
          throw new Error("Valid email is required");
        }
        return true;
      } catch {
        throw new Error("Form data must be a valid JSON object");
      }
    }),
    body("educationDetails").custom((value) => {
      try {
        JSON.parse(value);
        return true;
      } catch {
        throw new Error("Education details must be a valid JSON object");
      }
    }),
    body("programType").isIn(["UG", "PG"]).withMessage("Program type must be UG or PG"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { courseId, studentId, programType } = req.body;
      const formData = JSON.parse(req.body.formData);
      const educationDetails = JSON.parse(req.body.educationDetails);

      if (!formData.aadhaarNumber || !/^\d{12}$/.test(formData.aadhaarNumber)) {
        return res.status(400).json({ message: "Valid 12-digit Aadhaar number is required" });
      }
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        return res.status(400).json({ message: "Valid email is required" });
      }

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Check for document-related comments in existing application
      let hasDocumentComments = false;
      let application = await ApplicationForm.findOne({ studentId, courseId });
      if (application && application.fieldComments) {
        hasDocumentComments = Array.from(application.fieldComments.keys()).some(
          (key) => key.startsWith("document_") || key === "documents"
        );
      }

      // Merge new uploads with existing documents
      const documents = [];
      let fileIndex = 0; // Track req.files index

      console.log("Received formData.documents:", formData.documents);
      if (formData.documents && Array.isArray(formData.documents)) {
        formData.documents.forEach((doc) => {
          if (doc.filename && doc.path && doc.type) {
            // Preserve existing document
            documents.push({
              type: doc.type,
              filename: doc.filename,
              path: doc.path,
              originalName: doc.originalName,
              mimetype: doc.mimetype,
              size: doc.size,
            });
          } else if (doc.type && fileIndex < (req.files?.length || 0)) {
            // New file upload
            const file = req.files[fileIndex];
            documents.push({
              type: doc.type,
              filename: file.filename,
              path: file.path,
              originalName: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
            });
            fileIndex++;
          }
        });
      }

      // Validate commented documents
      if (hasDocumentComments) {
        const commentedDocIndices = Array.from(application.fieldComments.keys())
          .filter((key) => key.startsWith("document_"))
          .map((key) => parseInt(key.replace("document_", ""), 10));
        const commentedDocTypes = commentedDocIndices
          .map((index) => application.formData.documents[index]?.type)
          .filter(Boolean);

        console.log("Commented doc types:", commentedDocTypes);
        console.log("Documents:", documents);

        const missingCommentedDocs = commentedDocTypes.filter(
          (docType) => !documents.some((doc) => doc.type === docType)
        );

        if (missingCommentedDocs.length > 0) {
          return res.status(400).json({
            message: `Missing documents for: ${missingCommentedDocs.join(", ")}`,
          });
        }

        if (
          application.fieldComments.has("documents") &&
          documents.length === 0
        ) {
          return res.status(400).json({
            message: "Please upload at least one document due to general document comments.",
          });
        }
      }

      console.log("Final documents saved:", documents);
      formData.documents = documents;

      if (application && application.status === "verified") {
        return res.status(400).json({ message: "Application has already been verified" });
      }

      if (application) {
        // Update existing application (draft or rejected)
        application.formData = formData;
        application.educationDetails = educationDetails;
        application.programType = programType;
        application.status = "pending";
        application.lastActiveSection = 0;
        application.fieldComments = {}; // Clear comments on resubmission
        application.commentsRead = false;
      } else {
        // Create new application
        application = new ApplicationForm({
          courseId,
          studentId,
          formData,
          educationDetails,
          programType,
          status: "pending",
        });
      }

      await application.save();
      res.status(201).json({ message: "Application submitted successfully" });
    } catch (error) {
      console.error("Error submitting application:", error);
      if (error instanceof multer.MulterError) {
        return res.status(400).json({ message: `File upload error: ${error.message}` });
      }
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map((err) => ({
          field: err.path,
          message: err.message,
        }));
        const filteredComments = validationErrors.reduce((acc, err) => {
          if (err.message.trim()) {
            acc[err.field] = err.message;
          }
          return acc;
        }, {});
        console.error("MongoDB validation errors:", filteredComments);
        return res.status(400).json({ message: "Validation error", errors: filteredComments });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Get submitted or draft application for a student
router.get("/get-application/:studentId/:courseId", auth, async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Fetch the application (draft or submitted)
    const application = await ApplicationForm.findOne({ studentId, courseId });
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Serve uploaded files
router.get("/uploads/applications/:filename", auth, async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "..", "Uploads", "applications", filename);
    console.log(`Attempting to serve file at: ${filePath}`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`File not found at ${filePath}`);
      return res.status(404).json({ message: "File not found" });
    }

    console.log(`Serving file: ${filePath}`);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).json({ message: "Error serving file" });
      }
    });
  } catch (error) {
    console.error("Error serving file:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;