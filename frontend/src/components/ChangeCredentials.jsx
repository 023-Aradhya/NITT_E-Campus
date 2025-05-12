import React, { useState } from "react";
import axios from "axios";
import "./ChangeCredentials.css";
import { useNavigate } from "react-router-dom";

const ChangeCredentials = () => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState(null); // null, "password", or "email"
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    currentEmail: "",
    newEmail: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = formData;

    // Validation
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 4) {
      setError("New password must be at least 4 characters long.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/change-password`,
        { currentPassword, newPassword, confirmNewPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setSuccess(response.data.message);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        currentEmail: "",
        newEmail: "",
      });

      setTimeout(() => {
        setActiveForm(null);
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data.message || "Something went wrong. Please try again.");
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const { currentEmail, newEmail } = formData;

    // Validation
    if (!currentEmail || !newEmail) {
      setError("All fields are required.");
      return;
    }
    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(newEmail)) {
      setError("Please enter a valid new email address.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/change-email`,
        { currentEmail, newEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      setSuccess(response.data.message);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        currentEmail: "",
        newEmail: "",
      });

      setTimeout(() => {
        setActiveForm(null);
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="change-credentials-container">
      <h2>Change Credentials</h2>
      {!activeForm ? (
        <div className="button-container">
          <button
            className="change-credentials-btn"
            onClick={() => setActiveForm("password")}
          >
            Change Password
          </button>
          <button
            className="change-credentials-btn"
            onClick={() => setActiveForm("email")}
          >
            Change Email
          </button>
        </div>
      ) : (
        <div className="form-container">
          {activeForm === "password" && (
            <form onSubmit={handlePasswordSubmit} className="change-credentials-form">
              <h3>Change Password</h3>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
              <div className="form-actions">
                <button type="submit" className="change-credentials-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setActiveForm(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
          {activeForm === "email" && (
            <form onSubmit={handleEmailSubmit} className="change-credentials-form">
              <h3>Change Email</h3>
              <div className="form-group">
                <label>Current Email</label>
                <input
                  type="email"
                  name="currentEmail"
                  value={formData.currentEmail}
                  onChange={handleChange}
                  placeholder="Enter current email"
                  required
                />
              </div>
              <div className="form-group">
                <label>New Email</label>
                <input
                  type="email"
                  name="newEmail"
                  value={formData.newEmail}
                  onChange={handleChange}
                  placeholder="Enter new email"
                  required
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
              <div className="form-actions">
                <button type="submit" className="change-credentials-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setActiveForm(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ChangeCredentials;