import React, { useState, useEffect } from "react";
import "./ApplicationForm.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import PersonalDetails from "./application-form-sections/PersonalDetails";
import ContactInformation from "./application-form-sections/ContactInformation";
import ParentDetails from "./application-form-sections/ParentDetails";
import AcademicDetails from "./application-form-sections/AcademicDetails";
import DocumentUpload from "./application-form-sections/DocumentUpload";
import Declaration from "./application-form-sections/Declaration";
import ViewMode from "./application-form-sections/ViewMode";

const ApplicationForm = () => {
  const { courseId } = useParams();
  const sections = [
    "Personal Details",
    "Contact Information",
    "Parent/Guardian Details",
    "Academic Details",
    "Documents Upload",
    "Declaration",
  ];

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    nationality: "",
    aadhaarNumber: "",
    phoneNumber: "",
    email: "",
    alternateEmail: "",
    currentAddress: "",
    permanentAddress: "",
    emergencyContact: "",
    fathersName: "",
    mothersName: "",
    fathersOccupation: "",
    mothersOccupation: "",
    fathersContact: "",
    mothersContact: "",
    documents: [],
    agreement: false,
    hasPostgraduate: "No",
  });

  const [previousFormData, setPreviousFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    nationality: "",
    aadhaarNumber: "",
    phoneNumber: "",
    email: "",
    alternateEmail: "",
    currentAddress: "",
    permanentAddress: "",
    emergencyContact: "",
    fathersName: "",
    mothersName: "",
    fathersOccupation: "",
    mothersOccupation: "",
    fathersContact: "",
    mothersContact: "",
    documents: [],
    agreement: false,
    educationDetails: { tenth: [], twelth: [], graduation: [], postgraduate: [] },
  });

  const [educationDetails, setEducationDetails] = useState({
    tenth: [],
    twelth: [],
    graduation: [],
    postgraduate: [],
  });
  
  const [fieldComments, setFieldComments] = useState({});
  const [applicationStatus, setApplicationStatus] = useState("draft");
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState({});
  const [savedSections, setSavedSections] = useState({});
  const [openAccordion, setOpenAccordion] = useState(null);
  const [errors, setErrors] = useState({});
  const [popupMessage, setPopupMessage] = useState({ message: "", type: "" });
  const [selectedDocument, setSelectedDocument] = useState("");
  const [formStructure, setFormStructure] = useState({
    programType: "PG",
    requiredAcademicFields: [],
    requiredAcademicSubfields: {
      tenth: { percentage: false, yearOfPassing: false, board: false, schoolName: false, customFields: [] },
      twelth: { percentage: false, yearOfPassing: false, board: false, schoolName: false, customFields: [] },
      graduation: { percentage: false, yearOfPassing: false, university: false, collegeName: false, customFields: [] },
      postgraduate: { percentage: false, yearOfPassing: false, university: false, collegeName: false, customFields: [] },
    },
    requiredDocuments: [],
  });

  const navigate = useNavigate();
  const [isViewMode, setIsViewMode] = useState(false);
  const [editSection, setEditSection] = useState(null);

  // Added handlePhoneInputChange to format and validate phone numbers
  const handlePhoneInputChange = (e, field) => {
    let value = e.target.value.replace(/\s/g, ""); // Remove spaces
    
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field if it exists
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const showPopup = (message, type = "success") => {
    setPopupMessage({ message, type });
    setTimeout(() => setPopupMessage({ message: "", type: "" }), 4000);
  };

useEffect(() => {
  const fetchFormStructure = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/forms/get-form-structure/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFormStructure({
        programType: response.data.programType || "PG",
        requiredAcademicFields: response.data.requiredAcademicFields || [],
        requiredAcademicSubfields: response.data.requiredAcademicSubfields || {
          tenth: { percentage: false, yearOfPassing: false, board: false, schoolName: false, customFields: [] },
          twelth: { percentage: false, yearOfPassing: false, board: false, schoolName: false, customFields: [] },
          graduation: { percentage: false, yearOfPassing: false, university: false, collegeName: false, customFields: [] },
          postgraduate: { percentage: false, yearOfPassing: false, university: false, collegeName: false, customFields: [] },
        },
        requiredDocuments: response.data.requiredDocuments || [],
      });
    } catch (error) {
      console.error("Error fetching form structure:", error);
      showPopup("Error fetching form structure. Defaulting to PG.", "error");
    }
  };

  const fetchApplication = async () => {
    try {
      const token = localStorage.getItem("token");
      const studentId = localStorage.getItem("userId");
      if (!token || !studentId) {
        showPopup("Please log in to continue.", "error");
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/applications/get-application/${studentId}/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data) {
        console.log("Fetched documents:", response.data.formData.documents); // Add logging
        setApplicationStatus(response.data.status);
        // Ensure documents include full metadata
        const documents = response.data.formData.documents?.map(doc => ({
          type: doc.type,
          file: null, // File is not sent from backend, will be re-uploaded if needed
          filename: doc.filename,
          path: doc.path,
          originalName: doc.originalName,
          mimetype: doc.mimetype,
          size: doc.size,
        })) || [];
        setFormData({
          ...response.data.formData,
          documents,
          hasPostgraduate: response.data.formData.hasPostgraduate || "No",
        });
        setEducationDetails(response.data.educationDetails);
        setFieldComments(response.data.fieldComments || {});
        console.log("Fetched fieldComments:", response.data.fieldComments);
        setActiveIndex(response.data.lastActiveSection || 0);
        setCompletedSections(
          sections.reduce((acc, _, idx) => {
            if (idx < response.data.lastActiveSection) acc[idx] = true;
            return acc;
          }, {})
        );
        setSavedSections(
          sections.reduce((acc, _, idx) => {
            if (idx <= response.data.lastActiveSection) acc[idx] = true;
            return acc;
          }, {})
        );
        if (response.data.status === "rejected") {
          showPopup("Your application was rejected. You can edit and resubmit.", "warning");
        } else if (response.data.status === "draft") {
          showPopup("Resumed your saved application.", "success");
        } else if (response.data.status === "pending") {
          showPopup("Your application is pending. Please wait for verification.", "warning");
        } else if (response.data.status === "verified") {
          showPopup("Your application is already verified.", "success");
        }
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Error fetching application:", error);
        showPopup("Error loading application.", "error");
      }
    }
  };

  if (courseId) {
    fetchFormStructure();
    fetchApplication();
  }
}, [courseId]);


const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");
    const studentId = localStorage.getItem("userId");
    if (!token || !studentId) {
      showPopup("Please log in to save the draft.", "error");
      return;
    }

    if (applicationStatus !== "draft" && applicationStatus !== "rejected") {
      showPopup("Draft can only be saved for draft or rejected applications.", "error");
      return;
    }

    // Ensure formData.documents is an array
    const documentsArray = Array.isArray(formData.documents) ? formData.documents : [];
    // Prepare documents, preserving metadata for previously uploaded ones
    const validDocuments = documentsArray.map(doc => ({
      type: doc.type || "",
      file: doc.file instanceof File ? doc.file : null,
      filename: doc.filename || undefined,
      path: doc.path || undefined,
      originalName: doc.originalName || undefined,
      mimetype: doc.mimetype || undefined,
      size: doc.size || undefined,
    }));

    console.log("Preparing to save draft:", {
      formData,
      educationDetails,
      validDocuments,
      activeIndex,
      programType: formStructure.programType,
    });

    const submissionData = new FormData();
    submissionData.append("courseId", courseId);
    submissionData.append("studentId", studentId);
    submissionData.append("formData", JSON.stringify({
      ...formData,
      documents: validDocuments.map(doc => ({
        type: doc.type,
        filename: doc.filename,
        path: doc.path,
        originalName: doc.originalName,
        mimetype: doc.mimetype,
        size: doc.size,
      })).filter(doc => doc.type), // Filter out documents without type
    }));
    submissionData.append("educationDetails", JSON.stringify(educationDetails));
    submissionData.append("lastActiveSection", activeIndex);
    submissionData.append("status", "draft");
    submissionData.append("programType", formStructure.programType || "PG");

    // Append only new files
    validDocuments.forEach((doc) => {
      if (doc.file instanceof File) {
        submissionData.append("documents", doc.file);
      }
    });

    console.log("Saving draft with FormData:");
    for (let [key, value] of submissionData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/applications/save-draft`,
      submissionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setSavedSections((prev) => ({ ...prev, [activeIndex]: true }));
    setApplicationStatus("draft");
    showPopup("Draft saved successfully.", "success");
  } catch (error) {
    console.error("Error saving draft:", error);
    const errorDetails = error.response?.data?.errors || [];
    const errorMessage =
      error.response?.data?.message ||
      errorDetails.map(e => e.msg || e.message).join(", ") ||
      "Failed to save draft.";
    console.error("Server error details:", error.response?.data);
    console.error("Full error response:", errorDetails);
    showPopup(`Failed to save draft: ${errorMessage}`, "error");
  }
};

const handleSubmit = async () => {
// Prevent submission if application is already pending
  if (applicationStatus === "pending") {
    showPopup("You have already submitted the application.", "error");
    return;
  }  
  if (validateSection()) {
    if (!formData.aadhaarNumber || !/^\d{12}$/.test(formData.aadhaarNumber)) {
      setErrors((prev) => ({
        ...prev,
        aadhaarNumber: "Valid 12-digit Aadhaar number is required",
      }));
      showPopup("Please enter a valid Aadhaar number.", "error");
      return;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Valid email is required",
      }));
      showPopup("Please enter a valid email address.", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showPopup("Please log in to submit the application.", "error");
        return;
      }
      if (!token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)) {
        showPopup("Invalid token format. Please log in again.", "error");
        localStorage.removeItem("token");
        return;
      }

      const studentId = localStorage.getItem("userId");
      if (!studentId) {
        showPopup("User ID not found. Please log in again.", "error");
        return;
      }

      // Log form state for debugging
      console.log("Submission state:", {
        fieldComments,
        documents: formData.documents,
        requiredDocs: formStructure.requiredDocuments,
        hasPostgraduate: formData.hasPostgraduate,
      });

      // Check for document-related comments
      const documentCommentKeys = Object.keys(fieldComments).filter(
        (key) => key.startsWith("document_") || key === "documents"
      );
      const hasDocumentComments = documentCommentKeys.length > 0;

      // Include both new uploads and previously uploaded documents
      const validDocuments = formData.documents.filter(
        (doc) =>
          doc.type &&
          ((doc.file instanceof File && doc.file.size > 0) || // New upload
          (doc.filename && doc.path)) // Previously uploaded
      );

      const requiredDocs =
        formData.hasPostgraduate === "Yes"
          ? formStructure.requiredDocuments
          : formStructure.requiredDocuments.filter(
              (doc) => doc !== "Postgraduate Marksheet"
            );

      if (hasDocumentComments) {
        // Identify documents with specific comments (e.g., document_0)
        const commentedDocIndices = documentCommentKeys
          .filter((key) => key.startsWith("document_"))
          .map((key) => parseInt(key.replace("document_", ""), 10));
        const commentedDocTypes = commentedDocIndices
          .map((index) => formData.documents[index]?.type)
          .filter(Boolean);

        console.log("Document validation:", {
          documentCommentKeys,
          commentedDocIndices,
          commentedDocTypes,
          validDocTypes: validDocuments.map((doc) => doc.type),
        });

        // Check if commented documents have valid entries (new upload or draft)
        const missingCommentedDocs = commentedDocTypes.filter(
          (docType) =>
            !validDocuments.some((doc) => doc.type === docType) // No valid document (new or draft)
        );

        if (missingCommentedDocs.length > 0) {
          showPopup(
            `Missing documents for: ${missingCommentedDocs.join(", ")}. Please upload or ensure draft documents are valid.`,
            "error"
          );
          return;
        }

        // If general "documents" comment exists, require at least one document
        if (
          documentCommentKeys.includes("documents") &&
          validDocuments.length === 0
        ) {
          showPopup(
            "Please upload at least one document due to general document comments.",
            "error"
          );
          return;
        }
      }

      // Log final submission data
      console.log(
        "Final valid documents:",
        validDocuments.map((doc) => ({
          type: doc.type,
          file: doc.file?.name,
          filename: doc.filename,
          path: doc.path,
        }))
      );

      const submissionData = new FormData();
      submissionData.append("courseId", courseId);
      submissionData.append("studentId", studentId);
      submissionData.append(
        "formData",
        JSON.stringify({
          ...formData,
          documents: validDocuments.map((doc) => ({
            type: doc.type,
            filename: doc.filename,
            path: doc.path,
            originalName: doc.originalName,
            mimetype: doc.mimetype,
            size: doc.size,
          })),
        })
      );
      submissionData.append("educationDetails", JSON.stringify(educationDetails));
      submissionData.append("programType", formStructure.programType);

      // Append only new files
      validDocuments.forEach((doc) => {
        if (doc.file instanceof File) {
          submissionData.append("documents", doc.file);
        }
      });

      console.log("Submitting FormData:");
      for (let [key, value] of submissionData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/applications/submit-application`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPreviousFormData({ ...formData, educationDetails });
      setApplicationStatus("pending");
      setFieldComments({}); // Clear comments after resubmission
      showPopup(response.data.message, "success");
      setTimeout(() => navigate("/"), 2700);
    } catch (error) {
      console.error("Error submitting application:", error);
      let errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        `Failed to submit application: ${error.message}`;
      if (error.response?.status === 401) {
        errorMessage = "Session expired. Please log in again.";
        localStorage.removeItem("token");
      }
      showPopup(errorMessage, "error");
    }
  } else {
    showPopup("Please fix the errors in the form before submitting.", "error");
  }
};

  useEffect(() => {
    // Mark comments as read when the student views the form
    const markCommentsRead = async () => {
      if (applicationStatus === "rejected" && Object.keys(fieldComments).length > 0) {
        try {
          const token = localStorage.getItem("token");
          const studentId = localStorage.getItem("userId");
          await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/applications/mark-comments-read/${studentId}/${courseId}`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } catch (error) {
          console.error("Error marking comments as read:", error);
        }
      }
    };
    markCommentsRead();
  }, [fieldComments, applicationStatus, courseId]);

  const handleSectionClick = (index) => {
    if (index <= activeIndex || completedSections[index - 1] || completedSections[index]) {
      setActiveIndex(index);
      setIsViewMode(false);
      setEditSection(null);
    } else {
      showPopup("Please complete the previous sections first.", "error");
    }
  };

  const validateSection = () => {
    const newErrors = {};
    // Helper function to validate phone numbers
  const validatePhoneNumber = (phone, field) => {
    if (!phone) return `${field} is required`;
    let cleaned = phone.replace(/\s/g, ""); // Remove spaces
    // Strip +91 or 0 prefix
    if (cleaned.startsWith("+91")) cleaned = cleaned.slice(3);
    else if (cleaned.startsWith("0")) cleaned = cleaned.slice(1);
    // Check if the remaining number is 10 digits
    if (!/^\d{10}$/.test(cleaned)) {
      return `${field} must be a valid 10-digit number`;
    }
    return null;
  };
    if (activeIndex === 0) {
      if (!formData.fullName) newErrors.fullName = "Full name is required";
      if (!formData.dob) newErrors.dob = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.nationality) newErrors.nationality = "Nationality is required";
      if (!formData.aadhaarNumber || !/^\d{12}$/.test(formData.aadhaarNumber)) {
        newErrors.aadhaarNumber = "Valid 12-digit Aadhaar number is required";
      }
    } else if (activeIndex === 1) {
      const phoneError = validatePhoneNumber(formData.phoneNumber, "Phone number");
      if (phoneError) newErrors.phoneNumber = phoneError;
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Valid email is required";
      }
      if (!formData.currentAddress) newErrors.currentAddress = "Current address is required";
      if (!formData.permanentAddress) newErrors.permanentAddress = "Permanent address is required";
      const emergencyError = validatePhoneNumber(formData.emergencyContact, "Emergency contact");
      if (emergencyError) newErrors.emergencyContact = emergencyError;
    } else if (activeIndex === 2) {
      if (!formData.fathersName) newErrors.fathersName = "Father's name is required";
      if (!formData.mothersName) newErrors.mothersName = "Mother's name is required";
      if (!formData.fathersOccupation) newErrors.fathersOccupation = "Father's occupation is required";
      if (!formData.mothersOccupation) newErrors.mothersOccupation = "Mother's occupation is required";
      const fathersContactError = validatePhoneNumber(formData.fathersContact, "Father's contact");
      if (fathersContactError) newErrors.fathersContact = fathersContactError;
      const mothersContactError = validatePhoneNumber(formData.mothersContact, "Mother's contact");
      if (mothersContactError) newErrors.mothersContact = mothersContactError;
    } else if (activeIndex === 3) {
      // Add validation for academic details as needed
    } else if (activeIndex === 4) {
      // Add validation for documents as needed
    } else if (activeIndex === 5) {
      if (!formData.agreement) newErrors.agreement = "You must agree to the terms";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleNext = async () => {
  if (validateSection()) {
    if (applicationStatus === "pending") {
      showPopup("Your application is pending. Please wait for verification.", "warning");
      setCompletedSections((prev) => ({ ...prev, [activeIndex]: true }));
      setActiveIndex((prev) => Math.min(prev + 1, sections.length - 1));
      setErrors({});
      return;
    }
    if (applicationStatus === "verified") {
      showPopup("Your application is already verified.", "success");
      setCompletedSections((prev) => ({ ...prev, [activeIndex]: true }));
      setActiveIndex((prev) => Math.min(prev + 1, sections.length - 1));
      setErrors({});
      return;
    }
    try {
      // Check if the current section has been saved
      if (!savedSections[activeIndex]) {
        await handleSave(); // Save draft only if not already saved for draft or rejected status
      }
      setCompletedSections((prev) => ({ ...prev, [activeIndex]: true }));
      setActiveIndex((prev) => Math.min(prev + 1, sections.length - 1));
      setErrors({});
    } catch (error) {
      console.error("Error in handleNext:", error);
      showPopup("Failed to save draft before moving to next section.", "error");
    }
  } else {
    showPopup("Please fix the errors in the current section.", "error");
  }
};

  const handleBack = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
    setErrors({});
  };

  const handleViewForm = () => {
    setIsViewMode(true);
  };

  const handleEditSection = (index) => {
    setActiveIndex(index);
    setIsViewMode(false);
  };

  const handleCloseView = () => {
    setIsViewMode(false);
    setEditSection(null);
    setActiveIndex(sections.length - 1);
  };

  // Added AcademicDetails helper functions
  const toggleAccordion = (level, e) => {
    e.preventDefault();
    setOpenAccordion(openAccordion === level ? null : level);
  };

  const handleInputChange = (e, level, index) => {
    const { name, value } = e.target;
    setEducationDetails((prev) => {
      const updatedLevel = [...prev[level]];
      updatedLevel[index] = { ...updatedLevel[index], [name]: value };
      return { ...prev, [level]: updatedLevel };
    });
  };

  const handleAddEducation = (level) => {
    setEducationDetails((prev) => ({
      ...prev,
      [level]: [...prev[level], {}],
    }));
    setOpenAccordion(level);
  };

  const handleRemoveEducation = (level, index) => {
    setEducationDetails((prev) => {
      const updatedLevel = prev[level].filter((_, i) => i !== index);
      return { ...prev, [level]: updatedLevel };
    });
  };

  const handleSaveEducation = (level, index) => {
    // Validate the education entry
    const entry = educationDetails[level][index];
    const subfields = formStructure.requiredAcademicSubfields[level];
    let newErrors = {};

    if (subfields.schoolName && !entry.schoolName) {
      newErrors[`school${level === "tenth" ? "10" : "12"}_${index}`] = "School name is required";
    }
    if (subfields.board && !entry.board) {
      newErrors[`board${level === "tenth" ? "10" : "12"}_${index}`] = "Board is required";
    }
    if (subfields.percentage && (!entry.percentage || isNaN(entry.percentage) || entry.percentage > 100)) {
      newErrors[`percentage${level === "tenth" ? "10" : "12"}_${index}`] = "Valid percentage is required";
    }
    if (level === "twelth" && subfields.stream && !entry.stream) {
      newErrors[`stream12_${index}`] = "Stream is required";
    }
    if (subfields.subjects && !entry.subjects) {
      newErrors[`subjects${level === "tenth" ? "10" : "12"}_${index}`] = "Subjects are required";
    }
    if (level === "graduation" || level === "postgraduate") {
      if (subfields.collegeName && !entry.collegeName) {
        newErrors[`college${level === "graduation" ? "Grad" : "PG"}_${index}`] = "College name is required";
      }
      if (subfields.university && !entry.university) {
        newErrors[`university${level === "graduation" ? "Grad" : "PG"}_${index}`] = "University is required";
      }
      if (subfields.percentage && (!entry.percentage || isNaN(entry.percentage) || entry.percentage > 10)) {
        newErrors[`percentage${level === "graduation" ? "Grad" : "PG"}_${index}`] = "Valid CGPA is required";
      }
      if (subfields.degree && !entry.degree) {
        newErrors[`degree${level === "graduation" ? "Grad" : "PG"}_${index}`] = "Degree is required";
      }
      if (subfields.branch && !entry.branch) {
        newErrors[`branch${level === "graduation" ? "Grad" : "PG"}_${index}`] = "Branch is required";
      }
    }
    subfields.customFields.forEach((field) => {
      if (field.required && !entry[field.name]) {
        newErrors[`${field.name}_${level}_${index}`] = `${field.label} is required`;
      }
    });

  setErrors((prev) => ({ ...prev, ...newErrors }));
  if (Object.keys(newErrors).length === 0) {
    // Find the current level's index and determine the next level
    const academicLevels = formData.hasPostgraduate === "Yes"
      ? formStructure.requiredAcademicFields
      : formStructure.requiredAcademicFields.filter(l => l !== "postgraduate");
    const currentLevelIndex = academicLevels.indexOf(level);
    const nextLevel = currentLevelIndex < academicLevels.length - 1 ? academicLevels[currentLevelIndex + 1] : null;

    // Close current accordion and open the next one
    setOpenAccordion(nextLevel || null);
  } else {
    showPopup("Please fix errors in education details.", "error");
  }
};

  const handleAddDocument = () => {
    if (selectedDocument && !formData.documents.some(doc => doc.type === selectedDocument)) {
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, { type: selectedDocument, file: null }],
      }));
      setSelectedDocument("");
    }
  };

  const handleRemoveDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

const handleDocumentFileChange = (index, file) => {
  if (!file) return;
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (!allowedTypes.includes(file.type)) {
    showPopup("Only JPEG, PNG, and PDF files are allowed.", "error");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showPopup("File size must not exceed 5MB.", "error");
    return;
  }
  setFormData((prev) => {
    const updatedDocuments = [...prev.documents];
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      file,
      filename: undefined, // Clear backend metadata for new upload
      path: undefined,
      originalName: file.name,
      mimetype: file.type,
      size: file.size,
    };
    return { ...prev, documents: updatedDocuments };
  });
  setErrors((prev) => {
    const newErrors = { ...prev };
    delete newErrors[`document_${index}`];
    return newErrors;
  });
};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeIndex, isViewMode]);

  const renderSection = () => {
    console.log("Rendering section with fieldComments:", fieldComments); // Debug log
    switch (activeIndex) {
      case 0:
        return (
          <PersonalDetails
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            previousFormData={previousFormData}
            fieldComments={fieldComments}
          />
        );
      case 1:
        return (
          <ContactInformation
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            previousFormData={previousFormData}
            handlePhoneInputChange={handlePhoneInputChange}
            fieldComments={fieldComments}
          />
        );
      case 2:
        return (
          <ParentDetails
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            previousFormData={previousFormData}
            handlePhoneInputChange={handlePhoneInputChange}
            fieldComments={fieldComments}
          />
        );
      case 3:
        return (
          <AcademicDetails
            formData={formData}
            setFormData={setFormData}
            educationDetails={educationDetails}
            setEducationDetails={setEducationDetails}
            errors={errors}
            setErrors={setErrors}
            formStructure={formStructure}
            previousFormData={previousFormData}
            openAccordion={openAccordion}
            setOpenAccordion={setOpenAccordion}
            toggleAccordion={toggleAccordion}
            handleInputChange={handleInputChange}
            handleAddEducation={handleAddEducation}
            handleRemoveEducation={handleRemoveEducation}
            handleSaveEducation={handleSaveEducation}
            fieldComments={fieldComments}
          />
        );
      case 4:
        return (
          <DocumentUpload
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            formStructure={formStructure}
            selectedDocument={selectedDocument}
            setSelectedDocument={setSelectedDocument}
            handleAddDocument={handleAddDocument}
            handleRemoveDocument={handleRemoveDocument}
            handleDocumentFileChange={handleDocumentFileChange}
            fieldComments={fieldComments}
          />
        );
      case 5:
        return (
          <Declaration
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            fieldComments={fieldComments}
          />
        );
      default:
        return null;
    }
  };


  return (
    <div className="app-container">
      <div className="full-page-container">
        <div className="sidebar">
          <h3>Student Registration</h3>
          <ul>
            {sections.map((section, index) => (
              <li
                key={section}
                className={activeIndex === index ? "active" : completedSections[index] ? "completed" : ""}
                onClick={() => handleSectionClick(index)}
              >
                {section} {completedSections[index] && <span className="tick">✔</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="form-container">
          {popupMessage.message && (
            <div className={`popup-message ${popupMessage.type}`}>
              <span className="popup-icon">
                {popupMessage.type === "success" ? "✔" : popupMessage.type === "warning" ? "⚠" : "✖"}
              </span>
              {popupMessage.message}
            </div>
          )}
          {isViewMode ? (
            <ViewMode
              formData={formData}
              educationDetails={educationDetails}
              formStructure={formStructure}
              sections={sections}
              handleEditSection={handleEditSection}
              handleCloseView={handleCloseView}
              handleSubmit={handleSubmit}
              fieldComments={fieldComments}
            />
          ) : (
            <>
              <h2>{sections[activeIndex]}</h2>
              <form>
                {renderSection()}
                <div className="navigation-buttons">
                  {activeIndex > 0 && (
                    <button type="button" className="back-btn" onClick={handleBack}>
                      Back
                    </button>
                  )}
                  <button type="button" className="save-btn" onClick={handleSave} disabled={applicationStatus === "pending" || applicationStatus === "verified"}>
                    Save
                  </button>
                  {activeIndex < sections.length - 1 && (
                      <button
                        type="button"
                        className="next-btn"
                        onClick={handleNext}
                        disabled={applicationStatus === "pending" || applicationStatus === "verified"}
                      >
                        Next
                      </button>
                    )}
                  {activeIndex === sections.length - 1 && (
                    <>
                      <button type="button" className="view-btn" onClick={handleViewForm}>
                        View Form
                      </button>
                      <button type="button" className="submit-btn" onClick={handleSubmit}>
                        {applicationStatus === "rejected" ? "Resubmit" : "Submit"}
                      </button>
                    </>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;