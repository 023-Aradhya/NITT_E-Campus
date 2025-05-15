import React from "react";

const Declaration = ({ formData, setFormData, errors, fieldComments }) => {
  return (
    <div className="declaration">
      <label>
        <input
          type="checkbox"
          checked={formData.agreement}
          onChange={(e) => setFormData({ ...formData, agreement: e.target.checked })}
        />
        I agree to the terms and conditions and confirm that the information provided is accurate.
      </label>
      {errors.agreement && <span className="error">{errors.agreement}</span>}
      {fieldComments.agreement && <span className="comment">{fieldComments.agreement}</span>}
    </div>
  );
};

export default Declaration;