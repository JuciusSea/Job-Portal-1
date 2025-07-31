import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Layout from '../components/Layout/Layout';
import Spinner from '../components/shared/Spinner';
import { Link } from 'react-router-dom';
import '../styles/Jobs.css'; // Import CSS mới

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [workTypeFilter, setWorkTypeFilter] = useState('');
  const { loading } = useSelector((state) => state.alerts);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get('/api/v1/jobs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (data.success) {
          setJobs(data.jobs);
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

  // Helper functions
  const getCompanyInitial = (company) => {
    return company ? company.charAt(0).toUpperCase() : '?';
  };

  const formatWorkType = (workType) => {
    if (!workType) return 'Full-time';
    return workType.charAt(0).toUpperCase() + workType.slice(1).toLowerCase();
  };

  const getWorkTypeTag = (workType) => {
    const type = workType?.toLowerCase() || 'fulltime';
    return `tag-${type.replace(/[^a-z]/g, '')}`;
  };

  const truncateDescription = (description, maxLength = 120) => {
    if (!description) return "No description available";
    return description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  };

  // Filter jobs based on search and work type
  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.position.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.workLocation.toLowerCase().includes(search.toLowerCase());

    const matchesWorkType = !workTypeFilter ||
      job.workType?.toLowerCase() === workTypeFilter.toLowerCase();

    return matchesSearch && matchesWorkType;
  });

  // Get unique work types for filter
  const workTypes = [...new Set(jobs.map(job => job.workType).filter(Boolean))];

  return (
    <Layout>
      <div className="jobs-container">
        {/* Header */}
        <div className="jobs-header">
          <h1 className="jobs-title">Latest Jobs</h1>
          <p className="jobs-subtitle">
            Discover your next career opportunity from top companies
          </p>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-container">
            <label htmlFor="search" className="search-label">
              <span className="icon-search"></span> Search Jobs
            </label>
            <input
              id="search"
              type="text"
              className="search-input"
              placeholder="Search by position, company, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        {workTypes.length > 0 && (
          <div className="filters-section">
            <h3 className="filters-title">Filter by Work Type</h3>
            <div className="filter-tags">
              <button
                className={`filter-tag ${!workTypeFilter ? 'active' : ''}`}
                onClick={() => setWorkTypeFilter('')}
              >
                All Types
              </button>
              {workTypes.map(type => (
                <button
                  key={type}
                  className={`filter-tag ${workTypeFilter === type ? 'active' : ''}`}
                  onClick={() => setWorkTypeFilter(type)}
                >
                  {formatWorkType(type)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Header */}
        {!loading && (
          <div className="results-header">
            <div className="results-count">
              <span className="jobs-found">{filteredJobs.length}</span> jobs found
              {search && ` for "${search}"`}
              {workTypeFilter && ` in ${formatWorkType(workTypeFilter)}`}
            </div>
            {filteredJobs.length > 0 && (
              <Link to="/post-job" className="view-all-btn">
                Post a Job
              </Link>
            )}
          </div>
        )}

        {/* Jobs Content */}
        {loading ? (
          <div className="jobs-spinner">
            <Spinner />
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="jobs-grid">
            {filteredJobs.map(job => (
              <div key={job._id} className="job-card-enhanced">
                <div className="job-header">
                  <div>
                    <h3 className="job-position-title">{job.position}</h3>
                    <div className="job-company-info">
                      <div className="company-logo">
                        {getCompanyInitial(job.company)}
                      </div>
                      <span>{job.company}</span>
                    </div>
                    <div className="job-location-info">
                      <span className="icon-location"></span>
                      <span>{job.workLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="job-description-preview">
                  {truncateDescription(job.description)}
                </div>

                <div className="job-footer">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="view-job-btn"
                  >
                    <span className="icon-briefcase"></span> View Details
                  </Link>
                  <div className={`job-tag ${getWorkTypeTag(job.workType)}`}>
                    {formatWorkType(job.workType)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-jobs-state">
            <div className="empty-icon">💼</div>
            <h3 className="empty-title">
              {search || workTypeFilter ? 'No jobs match your search' : 'No jobs available'}
            </h3>
            <p className="empty-description">
              {search || workTypeFilter
                ? 'Try adjusting your search terms or filters to find more opportunities.'
                : 'Check back later for new job postings, or be the first to post a job!'}
            </p>
            {(search || workTypeFilter) ? (
              <button
                className="try-different-search"
                onClick={() => {
                  setSearch('');
                  setWorkTypeFilter('');
                }}
              >
                Clear Filters
              </button>
            ) : (
              <Link to="/post-job" className="try-different-search">
                Post First Job
              </Link>
            )}
          </div>
        )}

        {/* Job Stats */}
        {!loading && jobs.length > 0 && (
          <div className="section-header" style={{ marginTop: '3rem', borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
            <div style={{ textAlign: 'center', width: '100%' }}>
              <p style={{ color: 'var(--text-gray)', margin: 0 }}>
                Total of <strong>{jobs.length}</strong> jobs from <strong>{new Set(jobs.map(job => job.company)).size}</strong> companies
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Jobs;