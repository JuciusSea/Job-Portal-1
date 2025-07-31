import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
// FIXED: Comment out problematic import
// import { logoutUser } from '../../redux/features/auth/authSlice';
import '../../styles/Layout.css';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  // FIXED: Simple logout without import
  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const getUserInitial = (user) => {
    if (!user) return '?';
    return (user.name || '').charAt(0).toUpperCase() ||
           (user.email || '').charAt(0).toUpperCase() || '?';
  };

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard': return 'Dashboard';
      case '/jobs': return 'Latest Jobs';
      case '/user/profile': return 'Profile';
      case '/post-job': return 'Post Job';
      case '/create-employee': return 'Create Employee';
      default:
        if (path.startsWith('/jobs/')) return 'Job Details';
        return 'Job Portal';
    }
  };

  // FIXED: Filter menu items based on user role
  const getUserRole = () => user?.role || 'user';

  const navigationItems = [
    {
      section: 'Main',
      items: [
        { path: '/dashboard', icon: 'icon-dashboard', label: 'Dashboard' },
        { path: '/jobs', icon: 'icon-jobs', label: 'Latest Jobs' },
        { path: '/user/profile', icon: 'icon-profile', label: 'Update Profile' }
      ]
    },
    {
      section: 'Actions',
      items: [
        // Post Job: only for employee and admin
        ...(getUserRole() === 'employee' || getUserRole() === 'admin' ?
          [{ path: '/post-job', icon: 'icon-post-job', label: 'Post Job' }] : []
        ),
        // Create Employee: only for admin
        ...(getUserRole() === 'admin' ?
          [{ path: '/create-employee', icon: 'icon-employees', label: 'Create Employee' }] : []
        )
      ].filter(item => item) // Remove empty items
    }
  ].filter(section => section.items.length > 0); // Remove empty sections

  const isActivePath = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="layout-container">
      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-visible' : 'mobile-hidden'}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">JP</div>
          <div className="sidebar-title">Job Portal</div>
        </div>

        {/* User Info */}
        <div className="sidebar-user">
          <div className="user-avatar">
            {getUserInitial(user)}
          </div>
          <div className="user-info">
            <div className="user-name">
              {user?.name ? `${user.name} ${user.lastName || ''}`.trim() : 'User'}
            </div>
            <div className="user-role">
              {user?.role || 'user'}
              {/* DEBUG: Show exact role */}
              <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>
                ({JSON.stringify(user?.role)})
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navigationItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="nav-section">
              <div className="nav-section-title">{section.section}</div>
              <ul className="nav-list">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="nav-item">
                    <Link
                      to={item.path}
                      className={`nav-link ${isActivePath(item.path) ? 'active' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className={`nav-icon ${item.icon}`}></span>
                      <span className="nav-text">{item.label}</span>
                      {item.badge && (
                        <span className="nav-badge">{item.badge}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Logout */}
          <div className="nav-section">
            <ul className="nav-list">
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="nav-link"
                  style={{
                    background: 'none',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span className="nav-icon icon-logout"></span>
                  <span className="nav-text">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="top-bar-left">
            <button
              className="sidebar-toggle"
              onClick={() => {
                if (window.innerWidth <= 768) {
                  setMobileMenuOpen(!mobileMenuOpen);
                } else {
                  setSidebarCollapsed(!sidebarCollapsed);
                }
              }}
            >
              <span className="icon-menu"></span>
            </button>
            <h1 className="page-title">{getPageTitle()}</h1>
          </div>

          <div className="top-bar-right">
            {/* Search Bar - Hidden on mobile */}
            <div className="search-bar">
              <span className="search-icon icon-search-top"></span>
              <input
                type="text"
                placeholder="Search jobs, companies..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    navigate(`/jobs?search=${encodeURIComponent(e.target.value.trim())}`);
                  }
                }}
              />
            </div>

            {/* User Dropdown */}
            <div className="user-dropdown">
              <button
                className="user-dropdown-toggle"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <div className="user-dropdown-avatar">
                  {getUserInitial(user)}
                </div>
                <span className="user-dropdown-name">
                  {user?.name || 'User'}
                </span>
              </button>

              <div className={`user-dropdown-menu ${userDropdownOpen ? 'active' : ''}`}>
                <Link to="/user/profile" className="dropdown-item">
                  <span className="dropdown-icon icon-profile"></span>
                  My Profile
                </Link>
                <Link to="/dashboard" className="dropdown-item">
                  <span className="dropdown-icon icon-dashboard"></span>
                  Dashboard
                </Link>

                {/* Admin Only Menu Items */}
                {(getUserRole() === 'employee' || getUserRole() === 'admin') && (
                  <>
                    <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid var(--border-light)' }} />
                    <Link to="/post-job" className="dropdown-item">
                      <span className="dropdown-icon icon-post-job"></span>
                      Post Job
                    </Link>
                  </>
                )}

                {getUserRole() === 'admin' && (
                  <Link to="/create-employee" className="dropdown-item">
                    <span className="dropdown-icon icon-employees"></span>
                    Create Employee
                  </Link>
                )}

                <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid var(--border-light)' }} />
                <button 
                  onClick={handleLogout}
                  className="dropdown-item"
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    width: '100%', 
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span className="dropdown-icon icon-logout"></span>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;