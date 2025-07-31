import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Homepage.css"; // Import CSS mới

const HomePage = () => {
  const [currentYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState({
    jobs: 1200,
    companies: 150,
    users: 5000,
    success: 89
  });

  // Animate numbers on mount
  useEffect(() => {
    const animateNumber = (element, start, end, duration) => {
      let startTime = null;
      const step = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current.toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    };

    // Animate stats after component mounts
    const timer = setTimeout(() => {
      const jobsEl = document.querySelector('.stat-jobs');
      const companiesEl = document.querySelector('.stat-companies');
      const usersEl = document.querySelector('.stat-users');
      const successEl = document.querySelector('.stat-success');

      if (jobsEl) animateNumber(jobsEl, 0, stats.jobs, 2000);
      if (companiesEl) animateNumber(companiesEl, 0, stats.companies, 2000);
      if (usersEl) animateNumber(usersEl, 0, stats.users, 2000);
      if (successEl) animateNumber(successEl, 0, stats.success, 2000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [stats]);

  const features = [
    {
      icon: "🔍",
      title: "Smart Job Search",
      description: "Find your perfect job with our intelligent matching system and advanced filters."
    },
    {
      icon: "🚀",
      title: "Career Growth",
      description: "Access opportunities that align with your career goals and skill development."
    },
    {
      icon: "🤝",
      title: "Top Companies",
      description: "Connect with leading companies across Vietnam and Southeast Asia."
    },
    {
      icon: "📈",
      title: "Professional Network",
      description: "Build meaningful connections and expand your professional network."
    }
  ];

  return (
    <div className="homepage-container">
      {/* Background Video */}
      <video autoPlay muted loop className="homepage-video">
        <source src="/assets/videos/bg.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="homepage-overlay"></div>

      {/* Main Content */}
      <div className="homepage-content">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-badge">
            🏆 Vietnam's #1 Career Platform
          </div>

          <h1 className="hero-title">
            Discover Your
            <br />
            Dream Career
          </h1>

          <p className="hero-subtitle">
            Search and manage your jobs with ease. Connect with top companies,
            explore career opportunities, and take the next step in your professional journey.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="hero-btn-primary">
              🚀 Get Started
            </Link>
            <Link to="/jobs" className="hero-btn-secondary">
              Browse Jobs
            </Link>
          </div>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <img
            src="/assets/images/logo/logo.png"
            alt="Job Portal Logo"
            className="card-logo"
          />

          <h2 className="card-title">Welcome Back!</h2>
          <p className="card-subtitle">
            Access your personalized job dashboard and continue your career journey.
          </p>

          <div className="card-actions">
            <Link to="/login" className="card-login-btn">
              🔑 Sign In to Continue
            </Link>

            <div className="card-register">
              New to our platform?{" "}
              <Link to="/register" className="card-register-link">
                Create Account
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <span className="feature-icon">{feature.icon}</span>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-number stat-jobs">0</div>
            <div className="stat-label">Active Jobs</div>
          </div>

          <div className="stat-item">
            <div className="stat-number stat-companies">0</div>
            <div className="stat-label">Companies</div>
          </div>

          <div className="stat-item">
            <div className="stat-number stat-users">0</div>
            <div className="stat-label">Job Seekers</div>
          </div>

          <div className="stat-item">
            <div className="stat-number">
              <span className="stat-success">0</span>%
            </div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Additional floating elements for visual appeal */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: '100px',
        height: '100px',
        background: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 4s ease-in-out infinite',
        zIndex: 0
      }}></div>

      <div style={{
        position: 'absolute',
        bottom: '30%',
        left: '5%',
        width: '80px',
        height: '80px',
        background: 'rgba(245, 158, 11, 0.1)',
        borderRadius: '50%',
        filter: 'blur(30px)',
        animation: 'float 6s ease-in-out infinite reverse',
        zIndex: 0
      }}></div>
    </div>
  );
};

export default HomePage;