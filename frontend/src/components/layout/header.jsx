import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

const Header = () => {
  const { user, isOrganizer, isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="main-header">
      <div className="logo-section">
        <Link to="/">
          <div className="logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h1>ProUp</h1>
        </Link>
      </div>

      <div className="nav-container">
        <nav className="nav-links">
          {/* Common links when not logged in */}
          {!isAuthenticated && (
            <>
              <Link to="/events">Events</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/enterprise">Enterprise</Link>
            </>
          )}

          {/* Student navigation */}
          {isAuthenticated && !isOrganizer && (
            <>
              <Link to="/events">Events</Link>
              <Link to="/achievements">Achievements</Link>
            </>
          )}

          {/* Organizer navigation */}
          {isAuthenticated && isOrganizer && (
            <>
              <Link to="/organizer/create-event">Create Event</Link>
              <Link to="/organizer/manage-prizes">Manage Event</Link>
            </>
          )}
        </nav>

        <div className="nav-actions">
          {/* Search Icon */}
          <button className="nav-icon-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>

          {/* Notifications Icon */}
          <button className="nav-icon-btn" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          {isAuthenticated ? (
            <div className="user-profile-section" ref={dropdownRef}>
              <div className="profile-trigger" onClick={toggleDropdown}>
                <div className="profile-icon">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={isDropdownOpen ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} />
                </svg>
              </div>

              {isDropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <span className="user-name">{user?.name}</span>
                    <span className="user-role">{isOrganizer ? "Organizer" : "Student"}</span>
                  </div>
                  <div className="dropdown-items">
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-nav-buttons">
              <Link to="/login" className="nav-login">Log in</Link>
              <Link to="/signup" className="nav-cta">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
