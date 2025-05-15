const PersonalDetails = ({ formData, setFormData, errors, previousFormData, fieldComments }) => {
  console.log("PersonalDetails fieldComments:", fieldComments);

  return (
    <div className="personal-details">
      <label>Full Name:</label>
      <input
        type="text"
        placeholder="Enter your full name"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        list="fullNameSuggestions"
        title={previousFormData.fullName ? `Previous: ${previousFormData.fullName}` : ""}
        required
        autoComplete="name"
      />
      <datalist id="fullNameSuggestions">
        {previousFormData.fullName && <option value={previousFormData.fullName} />}
      </datalist>
      {errors.fullName && <span className="error">{errors.fullName}</span>}
      {fieldComments.fullName && <span className="comment">{fieldComments.fullName}</span>}

      <label>Date of Birth:</label>
      <input
        type="date"
        value={formData.dob}
        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
        title={previousFormData.dob ? `Previous: ${previousFormData.dob}` : ""}
        required
        autoComplete="bday"
      />
      {errors.dob && <span className="error">{errors.dob}</span>}
      {fieldComments.dob && <span className="comment">{fieldComments.dob}</span>}

      <label>Gender:</label>
      <select
        value={formData.gender}
        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
        title={previousFormData.gender ? `Previous: ${previousFormData.gender}` : ""}
        required
        autoComplete="sex"
      >
        <option value="">Select</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      {errors.gender && <span className="error">{errors.gender}</span>}
      {fieldComments.gender && <span className="comment">{fieldComments.gender}</span>}

      <label>Nationality:</label>
      <input
        type="text"
        placeholder="Enter your nationality"
        value={formData.nationality}
        onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
        list="nationalitySuggestions"
        title={previousFormData.nationality ? `Previous: ${previousFormData.nationality}` : ""}
        required
        autoComplete="country-name"
      />
      <datalist id="nationalitySuggestions">
        {previousFormData.nationality && <option value={previousFormData.nationality} />}
      </datalist>
      {errors.nationality && <span className="error">{errors.nationality}</span>}
      {fieldComments.nationality && <span className="comment">{fieldComments.nationality}</span>}

      <label>Aadhaar Number:</label>
      <input
        type="text"
        placeholder="Enter Aadhaar Number"
        value={formData.aadhaarNumber}
        onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
        list="aadhaarNumberSuggestions"
        title={previousFormData.aadhaarNumber ? `Previous: ${previousFormData.aadhaarNumber}` : ""}
        required
        autoComplete="off"
      />
      <datalist id="aadhaarNumberSuggestions">
        {previousFormData.aadhaarNumber && <option value={previousFormData.aadhaarNumber} />}
      </datalist>
      {errors.aadhaarNumber && <span className="error">{errors.aadhaarNumber}</span>}
      {fieldComments.aadhaarNumber && <span className="comment">{fieldComments.aadhaarNumber}</span>}
    </div>
  );
};
export default PersonalDetails;