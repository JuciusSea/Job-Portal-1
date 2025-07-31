import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Layout from '../components/Layout/Layout';
import Spinner from '../components/shared/Spinner';
import '../styles/Forms.css'; // Import CSS chung

const PostJob = () => {
  const [formData, setFormData] = useState({
    position: '',
    company: '',
    workLocation: '',
    workType: '',
    status: 'active',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loading } = useSelector((state) => state.alerts);
  const navigate = useNavigate();

  const workTypeOptions = [
    { value: '', label: 'Select work type' },
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'remote', label: 'Remote' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'interview', label: 'Interview' },
    { value: 'closed', label: 'Closed' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.position.trim()) {
      newErrors.position = 'Job position is required';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!formData.workLocation.trim()) {
      newErrors.workLocation = 'Work location is required';
    }

    if (!formData.workType) {
      newErrors.workType = 'Work type is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    } else if (formData.description.trim().length < 50) {
      newErrors.description = 'Description should be at least 50 characters';
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
      const { data } = await axios.post('/api/v1/jobs', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (data.success) {
        toast.success('Job posted successfully! 🎉');
        navigate('/jobs');
      } else {
        toast.error(data.message || 'Failed to post job');
      }
    } catch (error) {
      console.error('Post job error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to post job');
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
            <h1 className="form-title">Post a New Job</h1>
            <p className="form-subtitle">
              Find the perfect candidate by creating a detailed job posting
            </p>
          </div>

          {/* Guidelines */}
          <div className="profile-info">
            <h3>📝 Job Posting Guidelines</h3>
            <ul style={{ margin: '0.5rem 0 0 1.5rem', color: 'var(--text-gray)' }}>
              <li>Write a clear and specific job title</li>
              <li>Include detailed job description and requirements</li>
              <li>Specify work type and location accurately</li>
              <li>Review before posting to attract quality candidates</li>
            </ul>
          </div>

          {/* Form */}
          <form className="modern-form" onSubmit={handleSubmit}>
            {/* Job Position */}
            <div className="form-group">
              <label htmlFor="position" className="form-label required">
                Job Position
              </label>
              <input
                id="position"
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className={`form-input ${errors.position ? 'error' : ''}`}
                placeholder="e.g. Senior Software Engineer, Marketing Manager"
              />
              {errors.position && (
                <div className="form-error">
                  ⚠️ {errors.position}
                </div>
              )}
            </div>

            {/* Company & Location */}
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="company" className="form-label required">
                  Company
                </label>
                <input
                  id="company"
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={`form-input ${errors.company ? 'error' : ''}`}
                  placeholder="Company name"
                />
                {errors.company && (
                  <div className="form-error">
                    ⚠️ {errors.company}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="workLocation" className="form-label required">
                  Work Location
                </label>
                <input
                  id="workLocation"
                  type="text"
                  name="workLocation"
                  value={formData.workLocation}
                  onChange={handleChange}
                  className={`form-input ${errors.workLocation ? 'error' : ''}`}
                  placeholder="e.g. Ho Chi Minh City, Remote"
                />
                {errors.workLocation && (
                  <div className="form-error">
                    ⚠️ {errors.workLocation}
                  </div>
                )}
              </div>
            </div>

            {/* Work Type & Status */}
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="workType" className="form-label required">
                  Work Type
                </label>
                <select
                  id="workType"
                  name="workType"
                  value={formData.workType}
                  onChange={handleChange}
                  className={`form-select ${errors.workType ? 'error' : ''}`}
                >
                  {workTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.workType && (
                  <div className="form-error">
                    ⚠️ {errors.workType}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label required">
                Job Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Describe the job responsibilities, requirements, and what makes this role exciting..."
                rows="6"
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.5rem'
              }}>
                {errors.description ? (
                  <div className="form-error">
                    ⚠️ {errors.description}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    📝 Minimum 50 characters for a good description
                  </div>
                )}
                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  {formData.description.length} characters
                </div>
              </div>
            </div>

            {/* Preview Section */}
            {formData.position && formData.company && (
              <div className="profile-info" style={{ marginTop: '2rem' }}>
                <h3>👀 Preview</h3>
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-dark)' }}>
                    {formData.position}
                  </h4>
                  <p style={{ margin: '0', color: 'var(--text-gray)' }}>
                    {formData.company} • {formData.workLocation} • {formData.workType}
                  </p>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="submit"
                disabled={isSubmitting}
                className="form-button"
              >
                {isSubmitting ? (
                  <>
                    ⏳ Posting Job...
                  </>
                ) : (
                  <>
                    🚀 Post Job
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigate('/jobs')}
              className="form-button-secondary"
            >
              ← Back to Jobs
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PostJob;