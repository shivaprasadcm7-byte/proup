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
        <Link to="/"><h1>ProUp</h1></Link>
      </div>

      <div className="nav-container">
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          {isOrganizer ? (
            <Link to="/organizer/manage-prizes">Manage Prizes</Link>
          ) : (
            <Link to="/achievements">Achievements</Link>
          )}
        </nav>

        {isAuthenticated ? (
          <div className="user-profile-section" ref={dropdownRef}>
            <div className="profile-trigger" onClick={toggleDropdown}>
              <div className="profile-icon">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'}`} style={{ fontSize: '0.8rem' }}></i>
            </div>

            {isDropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <span className="user-name">{user?.name}</span>
                  <span className="user-role">{isOrganizer ? "Organizer" : "Student"}</span>
                </div>
                <div className="dropdown-items">
                  <Link to="/achievements" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                    <i className="fas fa-medal"></i> My Achievements
                  </Link>
                  {isOrganizer && (
                    <>
                      <Link to="/organizer/create-event" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                        <i className="fas fa-plus-circle"></i> Create Event
                      </Link>
                      <Link to="/organizer/manage-prizes" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                        <i className="fas fa-trophy"></i> Manage Prizes
                      </Link>
                    </>
                  )}
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-nav-buttons">
            <Link to="/login" className="nav-btn btn-login">Login</Link>
            <Link to="/signup" className="nav-btn btn-signup">Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
