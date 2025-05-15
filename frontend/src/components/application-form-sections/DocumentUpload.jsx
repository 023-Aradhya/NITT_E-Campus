import React from "react";

const DocumentUpload = ({
  formData,
  setFormData,
  errors,
  setErrors,
  formStructure,
  selectedDocument,
  setSelectedDocument,
  handleAddDocument,
  handleRemoveDocument,
  handleDocumentFileChange,
  fieldComments,
}) => {
  // Helper function to determine if a document is already added
  const isDocumentAdded = (docType) => {
    return formData.documents.some((doc) => doc.type === docType);
  };

  return (
    <div className="document-upload">
      <div className="document-selector">
        <select
          value={selectedDocument}
          onChange={(e) => setSelectedDocument(e.target.value)}
        >
          <option value="">Select Document</option>
          {(formData.hasPostgraduate === "Yes"
            ? formStructure.requiredDocuments
            : formStructure.requiredDocuments.filter(
                (doc) => doc !== "Postgraduate Marksheet"
              )
          ).map((doc, idx) => (
            <option
              key={idx}
              value={doc}
              disabled={isDocumentAdded(doc)}
              style={{
                color: isDocumentAdded(doc) ? "#888" : "#000",
                opacity: isDocumentAdded(doc) ? 0.5 : 1,
              }}
            >
              {doc}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAddDocument}
          disabled={
            !selectedDocument ||
            formData.documents.length >=
              (formData.hasPostgraduate === "Yes"
                ? formStructure.requiredDocuments.length
                : formStructure.requiredDocuments.filter(
                    (doc) => doc !== "Postgraduate Marksheet"
                  ).length)
          }
        >
          Add Document
        </button>
      </div>
      <div className="document-list">
        {formData.documents.map((doc, index) => (
          <div key={index} className="document-row">
            <span>{doc.type}</span>
            <div className="file-input-container">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => handleDocumentFileChange(index, e.target.files[0])}
              />
              {doc.originalName && !doc.file && (
                <span className="file-name">
                  Uploaded: {doc.originalName}
                </span>
              )}
            </div>
            <button
              type="button"
              className="remove-btn"
              onClick={() => handleRemoveDocument(index)}
            >
              Remove
            </button>
            {errors[`document_${index}`] && (
              <span className="error">{errors[`document_${index}`]}</span>
            )}
            {fieldComments[`document_${index}`] && (
              <span className="comment">{fieldComments[`document_${index}`]}</span>
            )}
          </div>
        ))}
      </div>
      {errors.documents && <span className="error">{errors.documents}</span>}
      {fieldComments.documents && (
        <span className="comment">{fieldComments.documents}</span>
      )}
    </div>
  );
};

export default DocumentUpload;