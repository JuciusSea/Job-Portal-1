import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Spinner from '../components/shared/Spinner';
import '../styles/Dashboard.css'; 

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const { loading } = useSelector((state) => state.alerts);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get('/api/v1/jobs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (data.success) {
          setJobs(data.jobs.slice(0, 6)); // Hiển thị 6 jobs thay vì 5
        } else {
          toast.error('Failed to load jobs: ' + data.message);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error.response?.data || error.message);
        toast.error('Failed to load jobs. Please try again.');
      }
    };
    fetchJobs();
  }, []);

  // Helper function để lấy chữ cái đầu của company
  const getCompanyInitial = (company) => {
    return company ? company.charAt(0).toUpperCase() : '?';
  };

  // Helper function để format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Header Section */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back! Here's what's happening with your job search.
          </p>
        </div>

        {/* Recent Jobs Section */}
        <div className="section-header">
          <h2 className="section-title">Recent Jobs</h2>
          <Link to="/jobs" className="view-all-btn">
            View All Jobs →
          </Link>
        </div>

        {loading ? (
          <div className="dashboard-spinner">
            <Spinner />
          </div>
        ) : jobs.length > 0 ? (
          <div className="jobs-grid">
            {jobs.map(job => (
              <div key={job._id} className="job-card">
                <div className="job-card-header">
                  <div>
                    <h3 className="job-position">{job.position}</h3>
                    <div className="job-company">
                      <div className="company-icon">
                        {getCompanyInitial(job.company)}
                      </div>
                      <span>{job.company}</span>
                    </div>
                    <div className="job-location">
                      <span className="icon-location"></span>
                      <span>{job.workLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="job-meta">
                  <div className="job-meta-item">
                    <span className="icon-calendar"></span>
                    <span>Posted: {formatDate(job.createdAt)}</span>
                  </div>
                  <div className="job-meta-item">
                    <span className="icon-users"></span>
                    <span>Type: {job.workType || 'Full-time'}</span>
                  </div>
                </div>

                <div className="job-actions">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="view-details-btn"
                  >
                    View Details
                  </Link>
                  <div className={`job-status ${job.status === 'interview' ? 'status-active' : 'status-pending'}`}>
                    {job.status || 'Active'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No Jobs Found</h3>
            <p>Start your job search journey by exploring available positions.</p>
            <Link to="/jobs" className="empty-state-btn">
              Browse Jobs
            </Link>
          </div>
        )}

        {/* Quick Stats Section (Optional Enhancement) */}
        {jobs.length > 0 && (
          <div className="section-header" style={{ marginTop: '3rem' }}>
            <h2 className="section-title">Quick Stats</h2>
          </div>
        )}

        {jobs.length > 0 && (
          <div className="jobs-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="job-card" style={{ textAlign: 'center', padding: '2rem' }}>
              <h3 style={{ fontSize: '2rem', color: 'var(--primary-blue)', margin: '0' }}>
                {jobs.length}
              </h3>
              <p style={{ margin: '0.5rem 0 0', color: 'var(--text-gray)' }}>Recent Jobs</p>
            </div>

            <div className="job-card" style={{ textAlign: 'center', padding: '2rem' }}>
              <h3 style={{ fontSize: '2rem', color: 'var(--accent-orange)', margin: '0' }}>
                {jobs.filter(job => job.status === 'interview').length}
              </h3>
              <p style={{ margin: '0.5rem 0 0', color: 'var(--text-gray)' }}>Interviews</p>
            </div>

            <div className="job-card" style={{ textAlign: 'center', padding: '2rem' }}>
              <h3 style={{ fontSize: '2rem', color: 'var(--primary-dark)', margin: '0' }}>
                {new Set(jobs.map(job => job.company)).size}
              </h3>
              <p style={{ margin: '0.5rem 0 0', color: 'var(--text-gray)' }}>Companies</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;