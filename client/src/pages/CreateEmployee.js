import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../components/Layout/Layout';
import Spinner from '../components/shared/Spinner';
import '../styles/Forms.css'; // Import CSS chung

const CreateEmployeePage = () => {
  const { loading } = useSelector((state) => state.alerts);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    location: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post('/api/v1/auth/create-employee', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (data.success) {
        toast.success('Employee created successfully! 🎉');
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Failed to create employee');
      }
    } catch (error) {
      console.error('Create employee error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error creating employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="form-loading">
          <Spinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="form-page-container">
        <div className="form-wrapper">
          {/* Header */}
          <div className="form-header">
            <h1 className="form-title">Create Employee Account</h1>
            <p className="form-subtitle">
              Add a new team member to your organization
            </p>
          </div>

          {/* Guidelines */}
          <div className="profile-info">
            <h3>👥 Employee Creation Guidelines</h3>
            <ul style={{ margin: '0.5rem 0 0 1.5rem', color: 'var(--text-gray)' }}>
              <li>Provide accurate employee information</li>
              <li>Use a secure password (minimum 6 characters)</li>
              <li>Employee will receive account details via email</li>
              <li>They can update their profile after first login</li>
            </ul>
          </div>

          {/* Form */}
          <form className="modern-form" onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name" className="form-label required">
                  First Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter first name"
                />
                {errors.name && (
                  <div className="form-error">
                    ⚠️ {errors.name}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label required">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <div className="form-error">
                    ⚠️ {errors.lastName}
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label required">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter work email address"
              />
              {errors.email && (
                <div className="form-error">
                  ⚠️ {errors.email}
                </div>
              )}
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                📧 This will be used for login and notifications
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label required">
                Temporary Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Create a temporary password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-gray)',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <div className="form-error">
                  ⚠️ {errors.password}
                </div>
              )}
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                🔒 Employee can change this after first login
              </div>
            </div>

            {/* Location */}
            <div className="form-group">
              <label htmlFor="location" className="form-label required">
                Location
              </label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`form-input ${errors.location ? 'error' : ''}`}
                placeholder="e.g. Ho Chi Minh City, Hanoi, Remote"
              />
              {errors.location && (
                <div className="form-error">
                  ⚠️ {errors.location}
                </div>
              )}
            </div>

            {/* Preview Section */}
            {formData.name && formData.lastName && formData.email && (
              <div className="profile-info" style={{ marginTop: '2rem' }}>
                <h3>👀 Employee Preview</h3>
                <div style={{ marginTop: '1rem' }}>
                  <p><strong>Name:</strong> {formData.name} {formData.lastName}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Location:</strong> {formData.location}</p>
                  <p><strong>Role:</strong> Employee</p>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="profile-info" style={{
              marginTop: '2rem',
              marginBottom: '1.5rem',
              background: '#fef3c7',
              borderLeft: '4px solid #f59e0b'
            }}>
              <h3>🔐 Security Notice</h3>
              <p style={{ margin: '0.5rem 0 0 0' }}>
                Make sure to share the login credentials securely with the new employee.
                Recommend they change their password upon first login.
              </p>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="submit"
                disabled={isSubmitting}
                className="form-button"
              >
                {isSubmitting ? (
                  <>
                    ⏳ Creating Account...
                  </>
                ) : (
                  <>
                    👤 Create Employee Account
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="form-button-secondary"
            >
              ← Back to Dashboard
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateEmployeePage;