import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setUser } from '../redux/features/auth/authSlice';
import Layout from '../components/Layout/Layout';
import Spinner from '../components/shared/Spinner';
import '../styles/Forms.css'; // Import CSS mới

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      console.log('User data:', user);
      setFormData({
        name: user.name || '',
        lastName: user.lastName || '',
        email: user.email || ''
      });
    }
  }, [user]);

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
      const { data } = await axios.put('/api/v1/user/update-user', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (data.success) {
        dispatch(setUser(data.data));
        toast.success('Profile updated successfully!');
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) {
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
            <h1 className="form-title">Update Profile</h1>
            <p className="form-subtitle">
              Keep your information up to date to enhance your job search experience
            </p>
          </div>

          {/* Profile Info */}
          <div className="profile-info">
            <h3>👤 Profile Information</h3>
            <p>
              Your profile information helps employers learn more about you.
              Make sure to keep it accurate and professional.
            </p>
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
                  placeholder="Enter your first name"
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
                  placeholder="Enter your last name"
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
                placeholder="Enter your email address"
              />
              {errors.email && (
                <div className="form-error">
                  ⚠️ {errors.email}
                </div>
              )}
            </div>

            {/* Additional Info Section */}
            <div className="profile-info" style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
              <h3>💡 Tips for a Better Profile</h3>
              <ul style={{ margin: '0.5rem 0 0 1.5rem', color: 'var(--text-gray)' }}>
                <li>Use your real name for professional credibility</li>
                <li>Keep your email current for job notifications</li>
                <li>Consider adding a professional photo (coming soon)</li>
              </ul>
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
                    ⏳ Updating Profile...
                  </>
                ) : (
                  <>
                    💾 Update Profile
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

          {/* Current Profile Summary */}
          <div className="profile-info" style={{ marginTop: '2rem' }}>
            <h3>📋 Current Profile Summary</h3>
            <div style={{ display: 'grid', gap: '0.5rem', marginTop: '1rem' }}>
              <p><strong>Name:</strong> {formData.name} {formData.lastName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Member since:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;