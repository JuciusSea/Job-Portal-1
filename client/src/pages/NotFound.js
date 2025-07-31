import React from "react";
import { Link } from "react-router-dom";
import '../styles/Forms.css'; // Import CSS chung

const NotFound = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-dark))',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decoration */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '200px',
        height: '200px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'float 6s ease-in-out infinite'
      }}></div>

      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'rgba(245, 158, 11, 0.1)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'float 8s ease-in-out infinite reverse'
      }}></div>

      {/* Main Content */}
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem 2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        {/* 404 Number */}
        <div style={{
          fontSize: '6rem',
          fontWeight: '900',
          background: 'linear-gradient(135deg, var(--primary-blue), var(--accent-orange))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1rem',
          lineHeight: '1'
        }}>
          404
        </div>

        {/* Icon */}
        <div style={{
          fontSize: '4rem',
          marginBottom: '1.5rem',
          opacity: '0.8'
        }}>
          🔍💼
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: 'var(--text-dark)',
          marginBottom: '1rem',
          lineHeight: '1.2'
        }}>
          Job Not Found
        </h1>

        {/* Description */}
        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-gray)',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Oops! The job or page you're looking for seems to have moved to a different position.
          Let's get you back on track to find your dream career!
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <Link
            to="/"
            style={{
              background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-dark))',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              boxShadow: 'var(--shadow-md)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'var(--shadow-md)';
            }}
          >
            🏠 Go to Homepage
          </Link>

          <Link
            to="/jobs"
            style={{
              background: 'transparent',
              color: 'var(--primary-blue)',
              border: '2px solid var(--primary-blue)',
              padding: '1rem 2rem',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'var(--primary-blue)';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--primary-blue)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            💼 Browse Jobs
          </Link>
        </div>

        {/* Help Text */}
        <div style={{
          padding: '1.5rem',
          background: 'var(--bg-gray)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)'
        }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: 'var(--text-dark)',
            marginBottom: '0.75rem'
          }}>
            🤔 What can you do?
          </h3>
          <div style={{
            fontSize: '0.9rem',
            color: 'var(--text-gray)',
            textAlign: 'left',
            lineHeight: '1.6'
          }}>
            <div style={{ marginBottom: '0.5rem' }}>• Search for jobs in your field</div>
            <div style={{ marginBottom: '0.5rem' }}>• Check out the latest job postings</div>
            <div style={{ marginBottom: '0.5rem' }}>• Update your profile</div>
            <div>• Post a new job if you're hiring</div>
          </div>
        </div>

        {/* Contact */}
        <div style={{
          marginTop: '2rem',
          fontSize: '0.9rem',
          color: 'var(--text-light)'
        }}>
          Need help? <Link
            to="/dashboard"
            style={{
              color: 'var(--primary-blue)',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Go to Dashboard
          </Link>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @media (max-width: 768px) {
          .not-found-container {
            padding: 1rem 0.5rem;
          }

          .not-found-content {
            padding: 2rem 1.5rem;
          }

          .not-found-404 {
            font-size: 4rem !important;
          }

          .not-found-icon {
            font-size: 3rem !important;
          }

          .not-found-title {
            font-size: 1.5rem !important;
          }

          .not-found-description {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;