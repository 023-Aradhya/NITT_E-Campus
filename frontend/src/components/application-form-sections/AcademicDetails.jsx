import React from "react";

const AcademicDetails = ({
  formData,
  setFormData,
  educationDetails,
  setEducationDetails,
  errors,
  setErrors,
  formStructure,
  previousFormData,
  openAccordion,
  setOpenAccordion,
  toggleAccordion,
  handleInputChange,
  handleAddEducation,
  handleRemoveEducation,
  handleSaveEducation,
  fieldComments,
}) => {
  const renderSubfieldInput = (level, subfield, entry, index) => {
    const subfields = formStructure.requiredAcademicSubfields[level];
    const isRequired = subfields[subfield] || (subfield === "stream" && level === "twelth" && subfields.stream);
    if (!isRequired) return null;

    const fieldProps = {
      name: subfield,
      value: entry[subfield] || "",
      onChange: (e) => handleInputChange(e, level, index),
      required: isRequired,
    };

    const commentKey = `${level}_${index}_${subfield}`;

    switch (subfield) {
      case "stream":
        return (
          <>
            <label>Stream:</label>
            <select {...fieldProps}>
              <option value="">Select Stream</option>
              <option value="Science">Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Arts">Arts</option>
            </select>
            {errors[`stream12_${index}`] && <span className="error">{errors[`stream12_${index}`]}</span>}
            {fieldComments[commentKey] && <span className="comment">{fieldComments[commentKey]}</span>}
          </>
        );
      case "subjects":
        return (
          <>
            <label>Subjects:</label>
            <textarea
              {...fieldProps}
              placeholder="Enter subjects (e.g., Math, Science)"
              list={`subjects${level}_${index}Suggestions`}
            />
            <datalist id={`subjects${level}_${index}Suggestions`}>
              {previousFormData.educationDetails[level][index]?.subjects && (
                <option value={previousFormData.educationDetails[level][index].subjects} />
              )}
            </datalist>
            {errors[`subjects${level === "tenth" ? "10" : "12"}_${index}`] && (
              <span className="error">{errors[`subjects${level === "tenth" ? "10" : "12"}_${index}`]}</span>
            )}
            {fieldComments[commentKey] && <span className="comment">{fieldComments[commentKey]}</span>}
          </>
        );
      case "percentage":
        return (
          <>
            <label>{(level === "graduation" || level === "postgraduate") ? "CGPA" : "Percentage"}:</label>
            <input
              type="number"
              {...fieldProps}
              placeholder={`Enter ${(level === "graduation" || level === "postgraduate") ? "CGPA" : "percentage"}`}
              list={`percentage${level}_${index}Suggestions`}
            />
            <datalist id={`percentage${level}_${index}Suggestions`}>
              {previousFormData.educationDetails[level][index]?.percentage && (
                <option value={previousFormData.educationDetails[level][index].percentage} />
              )}
            </datalist>
            {errors[`percentage${level === "tenth" ? "10" : level === "twelth" ? "12" : level === "graduation" ? "Grad" : "PG"}_${index}`] && (
              <span className="error">{errors[`percentage${level === "tenth" ? "10" : level === "twelth" ? "12" : level === "graduation" ? "Grad" : "PG"}_${index}`]}</span>
            )}
            {fieldComments[commentKey] && <span className="comment">{fieldComments[commentKey]}</span>}
          </>
        );
      case "yearOfPassing":
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = 1900; year <= currentYear; year++) {
          years.push(year);
        }
        return (
          <>
            <label>Year of Passing:</label>
            <select {...fieldProps} list={`year${level}_${index}Suggestions`}>
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <datalist id={`year${level}_${index}Suggestions`}>
              {previousFormData.educationDetails[level][index]?.year && (
                <option value={previousFormData.educationDetails[level][index].year} />
              )}
            </datalist>
            {errors[`year${level === "tenth" ? "10" : level === "twelth" ? "12" : level === "graduation" ? "Grad" : "PG"}_${index}`] && (
              <span className="error">{errors[`year${level === "tenth" ? "10" : level === "twelth" ? "12" : level === "graduation" ? "Grad" : "PG"}_${index}`]}</span>
            )}
            {fieldComments[commentKey] && <span className="comment">{fieldComments[commentKey]}</span>}
          </>
        );
      default:
        return (
          <>
            <label>{subfield.charAt(0).toUpperCase() + subfield.slice(1).replace(/([A-Z])/g, ' $1')}:</label>
            <input
              type={subfield === "schoolName" ? "text" : subfield === "board" ? "text" : subfield === "university" ? "text" : subfield === "collegeName" ? "text" : "text"}
              {...fieldProps}
              placeholder={`Enter ${subfield}`}
              list={`${subfield}${level}_${index}Suggestions`}
            />
            <datalist id={`${subfield}${level}_${index}Suggestions`}>
              {previousFormData.educationDetails[level][index]?.[subfield] && (
                <option value={previousFormData.educationDetails[level][index][subfield]} />
              )}
            </datalist>
            {errors[`${subfield}${level === "tenth" ? "10" : level === "twelth" ? "12" : level === "graduation" ? "Grad" : "PG"}_${index}`] && (
              <span className="error">{errors[`${subfield}${level === "tenth" ? "10" : level === "twelth" ? "12" : level === "graduation" ? "Grad" : "PG"}_${index}`]}</span>
            )}
            {fieldComments[commentKey] && <span className="comment">{fieldComments[commentKey]}</span>}
          </>
        );
    }
  };

  const renderCustomFieldInput = (level, field, entry, index) => {
    if (!field.required) return null;
    const fieldProps = {
      name: field.name,
      value: entry[field.name] || "",
      onChange: (e) => handleInputChange(e, level, index),
      required: field.required,
    };

    const commentKey = `${level}_${index}_${field.name}`;

    switch (field.type) {
      case "dropdown":
        return (
          <>
            <label>{field.label}:</label>
            <select {...fieldProps}>
              <option value="">Select {field.label}</option>
              {field.options && Array.isArray(field.options) ? (
                field.options.map((option, idx) => (
                  <option key={idx} value={option}>{option}</option>
                ))
              ) : (
                <option value="" disabled>No options available</option>
              )}
            </select>
            {errors[`${field.name}_${level}_${index}`] && (
              <span className="error">{errors[`${field.name}_${level}_${index}`]}</span>
            )}
            {fieldComments[commentKey] && <span className="comment">{fieldComments[commentKey]}</span>}
          </>
        );
      case "date":
        return (
          <>
            <label>{field.label}:</label>
            <input type="date" {...fieldProps} placeholder={`Enter ${field.label}`} />
            {errors[`${field.name}_${level}_${index}`] && (
              <span className="error">{errors[`${field.name}_${level}_${index}`]}</span>
            )}
            {fieldComments[commentKey] && <span className="comment">{fieldComments[commentKey]}</span>}
          </>
        );
      case "number":
        return (
          <>
            <label>{field.label}:</label>
            <input type="number" {...fieldProps} placeholder={`Enter ${field.label}`} />
            {errors[`${field.name}_${level}_${index}`] && (
              <span className="error">{errors[`${field.name}_${level}_${index}`]}</span>
            )}
            {fieldComments[commentKey] && <span className="comment">{fieldComments[commentKey]}</span>}
          </>
        );
      default:
        return (
          <>
            <label>{field.label}:</label>
            <input type="text" {...fieldProps} placeholder={`Enter ${field.label}`} />
            {errors[`${field.name}_${level}_${index}`] && (
              <span className="error">{errors[`${field.name}_${level}_${index}`]}</span>
            )}
            {fieldComments[commentKey] && <span className="comment">{fieldComments[commentKey]}</span>}
          </>
        );
    }
  };

  return (
    <div className="academic-details">
      {formStructure.programType === "PG" && (
        <div className="radio-group">
          <h4>Do you have completed postgraduate studies?</h4>
          <label>
            <input
              type="radio"
              value="Yes"
              checked={formData.hasPostgraduate === "Yes"}
              onChange={() => setFormData({ ...formData, hasPostgraduate: "Yes" })}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              value="No"
              checked={formData.hasPostgraduate === "No"}
              onChange={() => setFormData({ ...formData, hasPostgraduate: "No" })}
            />
            No
          </label>
          {fieldComments.hasPostgraduate && <span className="comment">{fieldComments.hasPostgraduate}</span>}
        </div>
      )}
      {(formData.hasPostgraduate === "Yes" ? formStructure.requiredAcademicFields : formStructure.requiredAcademicFields.filter(level => level !== "postgraduate")).map((level, idx) => (
        <div key={idx} className="accordion-section">
          <button
            className="accordion"
            onClick={(e) => toggleAccordion(level, e)}
          >
            {level === "tenth" ? "10th" : level === "twelth" ? "12th" : level.charAt(0).toUpperCase() + level.slice(1)} Details
            <span>{openAccordion === level ? "▲" : "▼"}</span>
          </button>
          {fieldComments[level] && (
            <span className="comment section-comment">{fieldComments[level]}</span>
          )}
          {openAccordion === level && (
            <div className="panel">
              {educationDetails[level].map((entry, index) => (
                <div key={index} className="academic-information">
                  {(level === "tenth" || level === "twelth") && (
                    <>
                      {renderSubfieldInput(level, "schoolName", entry, index)}
                      {renderSubfieldInput(level, "board", entry, index)}
                      {renderSubfieldInput(level, "yearOfPassing", entry, index)}
                      {renderSubfieldInput(level, "percentage", entry, index)}
                      {renderSubfieldInput(level, "subjects", entry, index)}
                      {level === "twelth" && renderSubfieldInput(level, "stream", entry, index)}
                    </>
                  )}
                  {(level === "graduation" || level === "postgraduate") && (
                    <>
                      {renderSubfieldInput(level, "collegeName", entry, index)}
                      {renderSubfieldInput(level, "degree", entry, index)}
                      {renderSubfieldInput(level, "branch", entry, index)}
                      {renderSubfieldInput(level, "university", entry, index)}
                      {renderSubfieldInput(level, "yearOfPassing", entry, index)}
                      {renderSubfieldInput(level, "percentage", entry, index)}
                    </>
                  )}
                  {formStructure.requiredAcademicSubfields[level].customFields.map((field) =>
                    renderCustomFieldInput(level, field, entry, index)
                  )}
                  <div className="button-group">
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => handleRemoveEducation(level, index)}
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      className="save-btn"
                      onClick={() => handleSaveEducation(level, index)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ))}
              {educationDetails[level].length === 0 && (
                <button
                  type="button"
                  className="add-btn"
                  onClick={() => handleAddEducation(level)}
                >
                  Add {level === "tenth" ? "10th" : level === "twelth" ? "12th" : level.charAt(0).toUpperCase() + level.slice(1)} Details
                </button>
              )}
            </div>
          )}
        </div>
      ))}
      {errors.academicDetails && (
        <div className="error">
          {errors.academicDetails.map((error, idx) => (
            <p key={idx}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcademicDetails;