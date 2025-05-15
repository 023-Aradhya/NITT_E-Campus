import React from "react";

const ContactInformation = ({ formData, setFormData, errors,setErrors, previousFormData, handlePhoneInputChange, fieldComments }) => {
  const handleAddressSyncChange = (e) => {
    const isSame = e.target.value === "Yes";
    setFormData((prev) => ({
      ...prev,
      isPermanentSameAsCurrent: isSame,
      permanentAddress: isSame ? prev.currentAddress : prev.permanentAddress,
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.permanentAddress;
      delete newErrors.isPermanentSameAsCurrent;
      return newErrors;
    });
  };

  return (
    <div className="contact-information">
      <label>Phone Number:</label>
      <input
        type="tel"
        placeholder="Enter phone number (e.g., 1234567890, +911234567890, or 01234567890)"
        value={formData.phoneNumber}
        onChange={(e) => handlePhoneInputChange(e, "phoneNumber")}
        list="phoneNumberSuggestions"
        title={previousFormData.phoneNumber ? `Previous: ${previousFormData.phoneNumber}` : ""}
        required
      />
      <datalist id="phoneNumberSuggestions">
        {previousFormData.phoneNumber && <option value={previousFormData.phoneNumber} />}
      </datalist>
      {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
      {fieldComments.phoneNumber && <span className="comment">{fieldComments.phoneNumber}</span>}

      <label>Email Address:</label>
      <input
        type="email"
        placeholder="Enter your email address"
        value={formData.email}
        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
        list="emailSuggestions"
        title={previousFormData.email ? `Previous: ${previousFormData.email}` : ""}
        required
      />
      <datalist id="emailSuggestions">
        {previousFormData.email && <option value={previousFormData.email} />}
      </datalist>
      {errors.email && <span className="error">{errors.email}</span>}
      {fieldComments.email && <span className="comment">{fieldComments.email}</span>}

      <label>Alternate Email Address (Optional):</label>
      <input
        type="email"
        placeholder="Enter alternate email address"
        value={formData.alternateEmail}
        onChange={(e) => setFormData((prev) => ({ ...prev, alternateEmail: e.target.value }))}
        list="alternateEmailSuggestions"
        title={previousFormData.alternateEmail ? `Previous: ${previousFormData.alternateEmail}` : ""}
      />
      <datalist id="alternateEmailSuggestions">
        {previousFormData.alternateEmail && <option value={previousFormData.alternateEmail} />}
      </datalist>
      {errors.alternateEmail && <span className="error">{errors.alternateEmail}</span>}
      {fieldComments.alternateEmail && <span className="comment">{fieldComments.alternateEmail}</span>}

      <label>Current Address:</label>
      <textarea
        placeholder="Enter your current address"
        value={formData.currentAddress}
        onChange={(e) => {
          const newValue = e.target.value;
          setFormData((prev) => ({
            ...prev,
            currentAddress: newValue,
            permanentAddress: prev.isPermanentSameAsCurrent ? newValue : prev.permanentAddress,
          }));
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.currentAddress;
            if (prev.isPermanentSameAsCurrent) delete newErrors.permanentAddress;
            return newErrors;
          });
        }}
        list="currentAddressSuggestions"
        title={previousFormData.currentAddress ? `Previous: ${previousFormData.currentAddress}` : ""}
        required
      />
      <datalist id="currentAddressSuggestions">
        {previousFormData.currentAddress && <option value={previousFormData.currentAddress} />}
      </datalist>
      {errors.currentAddress && <span className="error">{errors.currentAddress}</span>}
      {fieldComments.currentAddress && <span className="comment">{fieldComments.currentAddress}</span>}

      <div className="radio-group">
        <h4>Is your permanent address the same as your current address?</h4>
        <div className="radio-options">
          <label>
            <input
              type="radio"
              name="isPermanentSameAsCurrent"
              value="Yes"
              checked={formData.isPermanentSameAsCurrent === true}
              onChange={handleAddressSyncChange}
              required
              aria-label="Permanent address same as current: Yes"
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="isPermanentSameAsCurrent"
              value="No"
              checked={formData.isPermanentSameAsCurrent === false}
              onChange={handleAddressSyncChange}
              required
              aria-label="Permanent address same as current: No"
            />
            No
          </label>
        </div>
        {errors.isPermanentSameAsCurrent && (
          <span className="error">{errors.isPermanentSameAsCurrent}</span>
        )}
        {fieldComments.isPermanentSameAsCurrent && (
          <span className="comment">{fieldComments.isPermanentSameAsCurrent}</span>
        )}
      </div>

      <label>Permanent Address:</label>
      <textarea
        placeholder="Enter your permanent address"
        value={formData.permanentAddress}
        onChange={(e) => {
          setFormData({ ...formData, permanentAddress: e.target.value });
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.permanentAddress;
            return newErrors;
          });
        }}
        list="permanentAddressSuggestions"
        title={previousFormData.permanentAddress ? `Previous: ${previousFormData.permanentAddress}` : ""}
        required
      />
      <datalist id="permanentAddressSuggestions">
        {previousFormData.permanentAddress && <option value={previousFormData.permanentAddress} />}
      </datalist>
      {errors.permanentAddress && <span className="error">{errors.permanentAddress}</span>}
      {fieldComments.permanentAddress && <span className="comment">{fieldComments.permanentAddress}</span>}

      <label>Emergency Contact Number:</label>
      <input
        type="tel"
        placeholder="Enter emergency contact (e.g., 1234567890, +911234567890, or 01234567890)"
        value={formData.emergencyContact}
        onChange={(e) => handlePhoneInputChange(e, "emergencyContact")}
        list="emergencyContactSuggestions"
        title={previousFormData.emergencyContact ? `Previous: ${previousFormData.emergencyContact}` : ""}
        required
      />
      <datalist id="emergencyContactSuggestions">
        {previousFormData.emergencyContact && <option value={previousFormData.emergencyContact} />}
      </datalist>
      {errors.emergencyContact && <span className="error">{errors.emergencyContact}</span>}
      {fieldComments.emergencyContact && <span className="comment">{fieldComments.emergencyContact}</span>}
    </div>
  );
};

export default ContactInformation;