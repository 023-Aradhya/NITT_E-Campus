import React from "react";

const ParentDetails = ({ formData, setFormData, errors, previousFormData, handlePhoneInputChange, fieldComments }) => {
  console.log("ParentDetails fieldComments:", fieldComments); // Debug log

  return (
    <div className="parent-details">
      <label>Father's Name:</label>
      <input
        type="text"
        placeholder="Enter father's name"
        value={formData.fathersName}
        onChange={(e) => setFormData({ ...formData, fathersName: e.target.value })}
        list="fathersNameSuggestions"
        title={previousFormData.fathersName ? `Previous: ${previousFormData.fathersName}` : ""}
        required
      />
      <datalist id="fathersNameSuggestions">
        {previousFormData.fathersName && <option value={previousFormData.fathersName} />}
      </datalist>
      {errors.fathersName && <span className="error">{errors.fathersName}</span>}
      {fieldComments.fathersName && <span className="comment">{fieldComments.fathersName}</span>}

      <label>Mother's Name:</label>
      <input
        type="text"
        placeholder="Enter mother's name"
        value={formData.mothersName}
        onChange={(e) => setFormData({ ...formData, mothersName: e.target.value })}
        list="mothersNameSuggestions"
        title={previousFormData.mothersName ? `Previous: ${previousFormData.mothersName}` : ""}
        required
      />
      <datalist id="mothersNameSuggestions">
        {previousFormData.mothersName && <option value={previousFormData.mothersName} />}
      </datalist>
      {errors.mothersName && <span className="error">{errors.mothersName}</span>}
      {fieldComments.mothersName && <span className="comment">{fieldComments.mothersName}</span>}

      <label>Father's Occupation:</label>
      <input
        type="text"
        placeholder="Enter father's occupation"
        value={formData.fathersOccupation}
        onChange={(e) => setFormData({ ...formData, fathersOccupation: e.target.value })}
        list="fathersOccupationSuggestions"
        title={previousFormData.fathersOccupation ? `Previous: ${previousFormData.fathersOccupation}` : ""}
        required
      />
      <datalist id="fathersOccupationSuggestions">
        {previousFormData.fathersOccupation && <option value={previousFormData.fathersOccupation} />}
      </datalist>
      {errors.fathersOccupation && <span className="error">{errors.fathersOccupation}</span>}
      {fieldComments.fathersOccupation && <span className="comment">{fieldComments.fathersOccupation}</span>}

      <label>Mother's Occupation:</label>
      <input
        type="text"
        placeholder="Enter mother's occupation"
        value={formData.mothersOccupation}
        onChange={(e) => setFormData({ ...formData, mothersOccupation: e.target.value })}
        list="mothersOccupationSuggestions"
        title={previousFormData.mothersOccupation ? `Previous: ${previousFormData.mothersOccupation}` : ""}
        required
      />
      <datalist id="mothersOccupationSuggestions">
        {previousFormData.mothersOccupation && <option value={previousFormData.mothersOccupation} />}
      </datalist>
      {errors.mothersOccupation && <span className="error">{errors.mothersOccupation}</span>}
      {fieldComments.mothersOccupation && <span className="comment">{fieldComments.mothersOccupation}</span>}

      <label>Father's Contact Number:</label>
      <input
        type="tel"
        placeholder="Enter father's contact (e.g., 1234567890, +911234567890, or 01234567890)"
        value={formData.fathersContact}
        onChange={(e) => handlePhoneInputChange(e, "fathersContact")}
        list="fathersContactSuggestions"
        title={previousFormData.fathersContact ? `Previous: ${previousFormData.fathersContact}` : ""}
        required
      />
      <datalist id="fathersContactSuggestions">
        {previousFormData.fathersContact && <option value={previousFormData.fathersContact} />}
      </datalist>
      {errors.fathersContact && <span className="error">{errors.fathersContact}</span>}
      {fieldComments.fathersContact && <span className="comment">{fieldComments.fathersContact}</span>}

      <label>Mother's Contact Number:</label>
      <input
        type="tel"
        placeholder="Enter mother's contact (e.g., 1234567890, +911234567890, or 01234567890)"
        value={formData.mothersContact}
        onChange={(e) => handlePhoneInputChange(e, "mothersContact")}
        list="mothersContactSuggestions"
        title={previousFormData.mothersContact ? `Previous: ${previousFormData.mothersContact}` : ""}
        required
      />
      <datalist id="mothersContactSuggestions">
        {previousFormData.mothersContact && <option value={previousFormData.mothersContact} />}
      </datalist>
      {errors.mothersContact && <span className="error">{errors.mothersContact}</span>}
      {fieldComments.mothersContact && <span className="comment">{fieldComments.mothersContact}</span>}
    </div>
  );
};

export default ParentDetails;