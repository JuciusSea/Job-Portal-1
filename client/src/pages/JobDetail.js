import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Layout from '../components/Layout/Layout';
import Spinner from '../components/shared/Spinner';
import '../styles/JobDetail.css'; // Import CSS mới

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [applying, setApplying] = useState(false);
  const { loading } = useSelector((state) => state.alerts);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`/api/v1/jobs/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (data.success) {
          setJob(data.job);
        } else {
          toast.error('Failed to load job: ' + data.message);
        }
      } catch (error) {
        console.error('Error fetching job:', error.response?.data || error.message);
        toast.error('Failed to load job details');
        navigate('/jobs');
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleApply = async () => {
    setApplying(true);
    try {
      const { data } = await axios.post(`/api/v1/jobs/${id}/apply`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (data.success) {
        toast.success('Application submitted successfully!');
        // Refresh job data to update applicant count
        const updatedJob = await axios.get(`/api/v1/jobs/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (updatedJob.data.success) {
          setJob(updatedJob.data.job);
        }
      }
    } catch (error) {
      console.error('Apply error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to apply. Please login.');
      if (error.response?.status === 401) navigate('/login');
    } finally {
      setApplying(false);
    }
  };

  // Helper functions
  const getCompanyInitial = (company) => {
    return company ? company.charAt(0).toUpperCase() : '?';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'status-active';
      case 'pending': return 'status-pending';
      case 'interview': return 'status-interview';
      case 'rejected': return 'status-rejected';
      default: return 'status-active';
    }
  };

  const formatWorkType = (workType) => {
    if (!workType) return 'Full-time';
    return workType.charAt(0).toUpperCase() + workType.slice(1).toLowerCase();
  };

  const truncateDescription = (description, maxLength = 200) => {
    if (!description) return "No description available";
    return description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  };

  if (loading || !job) {
    return (
      <Layout>
        <div className="job-detail-spinner">
          <Spinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="job-detail-container">
        <div className="job-detail-wrapper">
          {/* Back Navigation */}
          <div className="back-navigation">
            <Link to="/jobs" className="back-btn">
              <span className="icon-back"></span>
              Back to Jobs
            </Link>
          </div>

          {/* Job Header */}
          <div className="job-detail-header">
            <div className="job-header-top">
              <div className="job-title-section">
                <h1>{job.position}</h1>
                <div className="job-company-header">
                  <div className="company-logo-large">
                    {getCompanyInitial(job.company)}
                  </div>
                  <div className="company-name-large">{job.company}</div>
                </div>
              </div>
              <button
                onClick={handleApply}
                disabled={applying}
                className="apply-button-header"
              >
                {applying ? 'Applying...' : 'Apply Now'}
              </button>
            </div>

            {/* Job Meta Grid */}
            <div className="job-meta-grid">
              <div className="job-meta-item">
                <div className="meta-label">Location</div>
                <div className="meta-value">
                  <span className="icon-location-detail"></span>
                  {job.workLocation}
                </div>
              </div>

              <div className="job-meta-item">
                <div className="meta-label">Work Type</div>
                <div className="meta-value">
                  <span className="icon-briefcase-detail"></span>
                  {formatWorkType(job.workType)}
                </div>
              </div>

              <div className="job-meta-item">
                <div className="meta-label">Posted Date</div>
                <div className="meta-value">
                  <span className="icon-calendar-detail"></span>
                  {formatDate(job.createdAt)}
                </div>
              </div>

              <div className="job-meta-item">
                <div className="meta-label">Status</div>
                <div className="meta-value">
                  <div className={`status-badge ${getStatusClass(job.status)}`}>
                    <span className="icon-status"></span>
                    {job.status || 'Active'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">
                  {Array.isArray(job.applicants) ? job.applicants.length : 0}
                </div>
                <div className="stat-label">Applicants</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  {Math.floor(Math.random() * 100) + 50}
                </div>
                <div className="stat-label">Views</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  {Math.floor((Date.now() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="stat-label">Days Posted</div>
              </div>
            </div>
          </div>

          {/* Job Content */}
          <div className="job-content">
            <div className="content-section">
              <h2 className="content-title">Job Description</h2>
              <div className="job-description-full">
                {expandedDescription
                  ? job.description || "No description available"
                  : truncateDescription(job.description, 300)
                }
                {job.description && job.description.length > 300 && (
                  <button
                    className="description-toggle-btn"
                    onClick={() => setExpandedDescription(!expandedDescription)}
                  >
                    {expandedDescription ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            </div>

            <div className="content-section">
              <h2 className="content-title">Company Information</h2>
              <div className="job-description-full">
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Location:</strong> {job.workLocation}</p>
                <p><strong>Industry:</strong> Technology & Software</p>
                <p>Join our dynamic team and make a meaningful impact in your career!</p>
              </div>
            </div>

            <div className="content-section">
              <h2 className="content-title">Job Requirements</h2>
              <div className="job-description-full">
                <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                  <li>Relevant experience in the field</li>
                  <li>Strong communication and teamwork skills</li>
                  <li>Ability to work in a fast-paced environment</li>
                  <li>Problem-solving and analytical thinking</li>
                  <li>Commitment to continuous learning and growth</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="job-actions">
            <h3 className="action-title">Ready to Apply?</h3>
            <p className="action-description">
              Join {job.company} and take the next step in your career journey.
              We're looking for talented individuals like you!
            </p>
            <button
              onClick={handleApply}
              disabled={applying}
              className="apply-button-main"
            >
              {applying ? (
                <>
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <span className="icon-briefcase-detail"></span>
                  Apply for this Position
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetail;