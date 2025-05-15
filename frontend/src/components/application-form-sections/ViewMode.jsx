import React from "react";

const ViewMode = ({
  formData,
  educationDetails,
  formStructure,
  sections,
  handleEditSection,
  handleCloseView,
  fieldComments,
}) => {
  // Helper function to format field labels
  // const formatLabel = (field) => {
  //   return field
  //     .replace(/([A-Z])/g, " $1")
  //     .replace(/^./, (str) => str.toUpperCase())
  //     .trim();
  // };

  return (
    <div className="view-modal">
      <div className="view-content">
        <h2>Review Your Application</h2>
        {sections.map((section, index) => (
          <div key={section} className="view-section">
            <h3>{section}</h3>
            {index === 0 && (
              <div className="personal-details">
                {formData.fullName && (
                  <p>
                    <strong>Full Name:</strong> {formData.fullName}{" "}
                    {fieldComments.fullName && (
                      <span className="comment">
                        ({fieldComments.fullName})
                      </span>
                    )}
                  </p>
                )}
                {formData.dob && (
                  <p>
                    <strong>Date of Birth:</strong> {formData.dob}{" "}
                    {fieldComments.dob && (
                      <span className="comment">({fieldComments.dob})</span>
                    )}
                  </p>
                )}
                {formData.gender && (
                  <p>
                    <strong>Gender:</strong> {formData.gender}{" "}
                    {fieldComments.gender && (
                      <span className="comment">({fieldComments.gender})</span>
                    )}
                  </p>
                )}
                {formData.nationality && (
                  <p>
                    <strong>Nationality:</strong> {formData.nationality}{" "}
                    {fieldComments.nationality && (
                      <span className="comment">
                        ({fieldComments.nationality})
                      </span>
                    )}
                  </p>
                )}
                {formData.aadhaarNumber && (
                  <p>
                    <strong>Aadhaar Number:</strong> {formData.aadhaarNumber}{" "}
                    {fieldComments.aadhaarNumber && (
                      <span className="comment">
                        ({fieldComments.aadhaarNumber})
                      </span>
                    )}
                  </p>
                )}
              </div>
            )}
            {index === 1 && (
              <div className="contact-information">
                {formData.phoneNumber && (
                  <p>
                    <strong>Phone Number:</strong> {formData.phoneNumber}{" "}
                    {fieldComments.phoneNumber && (
                      <span className="comment">
                        ({fieldComments.phoneNumber})
                      </span>
                    )}
                  </p>
                )}
                {formData.email && (
                  <p>
                    <strong>Email:</strong> {formData.email}{" "}
                    {fieldComments.email && (
                      <span className="comment">({fieldComments.email})</span>
                    )}
                  </p>
                )}
                {formData.alternateEmail && (
                  <p>
                    <strong>Alternate Email:</strong> {formData.alternateEmail}{" "}
                    {fieldComments.alternateEmail && (
                      <span className="comment">
                        ({fieldComments.alternateEmail})
                      </span>
                    )}
                  </p>
                )}
                {formData.currentAddress && (
                  <p>
                    <strong>Current Address:</strong> {formData.currentAddress}{" "}
                    {fieldComments.currentAddress && (
                      <span className="comment">
                        ({fieldComments.currentAddress})
                      </span>
                    )}
                  </p>
                )}
                {formData.permanentAddress && (
                  <p>
                    <strong>Permanent Address:</strong>{" "}
                    {formData.permanentAddress}{" "}
                    {fieldComments.permanentAddress && (
                      <span className="comment">
                        ({fieldComments.permanentAddress})
                      </span>
                    )}
                  </p>
                )}
                {formData.emergencyContact && (
                  <p>
                    <strong>Emergency Contact:</strong>{" "}
                    {formData.emergencyContact}{" "}
                    {fieldComments.emergencyContact && (
                      <span className="comment">
                        ({fieldComments.emergencyContact})
                      </span>
                    )}
                  </p>
                )}
              </div>
            )}
            {index === 2 && (
              <div className="parent-details">
                {formData.fathersName && (
                  <p>
                    <strong>Father's Name:</strong> {formData.fathersName}{" "}
                    {fieldComments.fathersName && (
                      <span className="comment">
                        ({fieldComments.fathersName})
                      </span>
                    )}
                  </p>
                )}
                {formData.mothersName && (
                  <p>
                    <strong>Mother's Name:</strong> {formData.mothersName}{" "}
                    {fieldComments.mothersName && (
                      <span className="comment">
                        ({fieldComments.mothersName})
                      </span>
                    )}
                  </p>
                )}
                {formData.fathersOccupation && (
                  <p>
                    <strong>Father's Occupation:</strong>{" "}
                    {formData.fathersOccupation}{" "}
                    {fieldComments.fathersOccupation && (
                      <span className="comment">
                        ({fieldComments.fathersOccupation})
                      </span>
                    )}
                  </p>
                )}
                {formData.mothersOccupation && (
                  <p>
                    <strong>Mother's Occupation:</strong>{" "}
                    {formData.mothersOccupation}{" "}
                    {fieldComments.mothersOccupation && (
                      <span className="comment">
                        ({fieldComments.mothersOccupation})
                      </span>
                    )}
                  </p>
                )}
                {formData.fathersContact && (
                  <p>
                    <strong>Father's Contact:</strong> {formData.fathersContact}{" "}
                    {fieldComments.fathersContact && (
                      <span className="comment">
                        ({fieldComments.fathersContact})
                      </span>
                    )}
                  </p>
                )}
                {formData.mothersContact && (
                  <p>
                    <strong>Mother's Contact:</strong> {formData.mothersContact}{" "}
                    {fieldComments.mothersContact && (
                      <span className="comment">
                        ({fieldComments.mothersContact})
                      </span>
                    )}
                  </p>
                )}
              </div>
            )}
            {index === 3 && (
              <div className="academic-details">
                {formStructure.programType === "PG" && (
                  <p>
                    <strong>Completed Postgraduate Studies:</strong>{" "}
                    {formData.hasPostgraduate}{" "}
                    {fieldComments.hasPostgraduate && (
                      <span className="comment">
                        ({fieldComments.hasPostgraduate})
                      </span>
                    )}
                  </p>
                )}
                {(formData.hasPostgraduate === "Yes"
                  ? formStructure.requiredAcademicFields
                  : formStructure.requiredAcademicFields.filter(
                      (level) => level !== "postgraduate"
                    )
                ).map((level) => (
                  <div key={level}>
                    <h4>
                      {level === "tenth"
                        ? "10th"
                        : level === "twelth"
                        ? "12th"
                        : level.charAt(0).toUpperCase() + level.slice(1)}{" "}
                      Details
                    </h4>
                    {educationDetails[level].map((entry, idx) => (
                      <div key={idx}>
                        {(level === "tenth" || level === "twelth") && (
                          <>
                            {entry.schoolName && (
                              <p>
                                <strong>School Name:</strong> {entry.schoolName}{" "}
                                {fieldComments[`${level}_${idx}_schoolName`] && (
                                  <span className="comment">
                                    ({fieldComments[`${level}_${idx}_schoolName`]})
                                  </span>
                                )}
                              </p>
                            )}
                            {entry.board && (
                              <p>
                                <strong>Board:</strong> {entry.board}{" "}
                                {fieldComments[`${level}_${idx}_board`] && (
                                  <span className="comment">
                                    ({fieldComments[`${level}_${idx}_board`]})
                                  </span>
                                )}
                              </p>
                            )}
                            {entry.yearOfPassing && (
                              <p>
                                <strong>Year of Passing:</strong>{" "}
                                {entry.yearOfPassing}{" "}
                                {fieldComments[
                                  `${level}_${idx}_yearOfPassing`
                                ] && (
                                  <span className="comment">
                                    (
                                    {
                                      fieldComments[
                                        `${level}_${idx}_yearOfPassing`
                                      ]
                                    }
                                    )
                                  </span>
                                )}
                              </p>
                            )}
                            {entry.percentage && (
                              <p>
                                <strong>Percentage:</strong> {entry.percentage}{" "}
                                {fieldComments[`${level}_${idx}_percentage`] && (
                                  <span className="comment">
                                    (
                                    {fieldComments[`${level}_${idx}_percentage`]}
                                    )
                                  </span>
                                )}
                              </p>
                            )}
                            {entry.subjects && (
                              <p>
                                <strong>Subjects:</strong> {entry.subjects}{" "}
                                {fieldComments[`${level}_${idx}_subjects`] && (
                                  <span className="comment">
                                    ({fieldComments[`${level}_${idx}_subjects`]})
                                  </span>
                                )}
                              </p>
                            )}
                            {level === "twelth" && entry.stream && (
                              <p>
                                <strong>Stream:</strong> {entry.stream}{" "}
                                {fieldComments[`${level}_${idx}_stream`] && (
                                  <span className="comment">
                                    ({fieldComments[`${level}_${idx}_stream`]})
                                  </span>
                                )}
                              </p>
                            )}
                          </>
                        )}
                        {(level === "graduation" || level === "postgraduate") && (
                          <>
                            {entry.collegeName && (
                              <p>
                                <strong>College Name:</strong>{" "}
                                {entry.collegeName}{" "}
                                {fieldComments[
                                  `${level}_${idx}_collegeName`
                                ] && (
                                  <span className="comment">
                                    (
                                    {
                                      fieldComments[
                                        `${level}_${idx}_collegeName`
                                      ]
                                    }
                                    )
                                  </span>
                                )}
                              </p>
                            )}
                            {entry.degree && (
                              <p>
                                <strong>Degree:</strong> {entry.degree}{" "}
                                {fieldComments[`${level}_${idx}_degree`] && (
                                  <span className="comment">
                                    ({fieldComments[`${level}_${idx}_degree`]})
                                  </span>
                                )}
                              </p>
                            )}
                            {entry.branch && (
                              <p>
                                <strong>Branch:</strong> {entry.branch}{" "}
                                {fieldComments[`${level}_${idx}_branch`] && (
                                  <span className="comment">
                                    ({fieldComments[`${level}_${idx}_branch`]})
                                  </span>
                                )}
                              </p>
                            )}
                            {entry.university && (
                              <p>
                                <strong>University:</strong> {entry.university}{" "}
                                {fieldComments[`${level}_${idx}_university`] && (
                                  <span className="comment">
                                    (
                                    {fieldComments[`${level}_${idx}_university`]}
                                    )
                                  </span>
                                )}
                              </p>
                            )}
                            {entry.yearOfPassing && (
                              <p>
                                <strong>Year of Passing:</strong>{" "}
                                {entry.yearOfPassing}{" "}
                                {fieldComments[
                                  `${level}_${idx}_yearOfPassing`
                                ] && (
                                  <span className="comment">
                                    (
                                    {
                                      fieldComments[
                                        `${level}_${idx}_yearOfPassing`
                                      ]
                                    }
                                    )
                                  </span>
                                )}
                              </p>
                            )}
                            {entry.percentage && (
                              <p>
                                <strong>CGPA:</strong> {entry.percentage}{" "}
                                {fieldComments[`${level}_${idx}_percentage`] && (
                                  <span className="comment">
                                    (
                                    {fieldComments[`${level}_${idx}_percentage`]}
                                    )
                                  </span>
                                )}
                              </p>
                            )}
                          </>
                        )}
                        {formStructure.requiredAcademicSubfields[
                          level
                        ].customFields.map((field) =>
                          entry[field.name] ? (
                            <p key={field.name}>
                              <strong>{field.label}:</strong> {entry[field.name]}{" "}
                              {fieldComments[`${level}_${idx}_${field.name}`] && (
                                <span className="comment">
                                  (
                                  {
                                    fieldComments[
                                      `${level}_${idx}_${field.name}`
                                    ]
                                  }
                                  )
                                </span>
                              )}
                            </p>
                          ) : null
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {index === 4 && (
              <div className="document-upload">
                {formData.documents.map(
                  (doc, idx) =>
                    doc.type && (
                      <p key={idx}>
                        <strong>{doc.type}:</strong>{" "}
                        {doc.file ? doc.file.name : doc.originalName || "No file uploaded"}{" "}
                        {fieldComments[`document_${idx}`] && (
                          <span className="comment">
                            ({fieldComments[`document_${idx}`]})
                          </span>
                        )}
                      </p>
                    )
                )}
                {fieldComments.documents && (
                  <p>
                    <strong>General Documents:</strong>{" "}
                    <span className="comment">{fieldComments.documents}</span>
                  </p>
                )}
              </div>
            )}
            {index === 5 && (
              <div className="declaration">
                {formData.agreement !== undefined && (
                  <p>
                    <strong>Agreement:</strong>{" "}
                    {formData.agreement ? "Agreed" : "Not Agreed"}{" "}
                    {fieldComments.agreement && (
                      <span className="comment">
                        ({fieldComments.agreement})
                      </span>
                    )}
                  </p>
                )}
              </div>
            )}
            <button
              type="button"
              className="edit-btn"
              onClick={() => handleEditSection(index)}
            >
              Edit {section}
            </button>
          </div>
        ))}
        <div className="view-navigation">
          <button type="button" className="back-btn" onClick={handleCloseView}>
            Back to Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewMode;