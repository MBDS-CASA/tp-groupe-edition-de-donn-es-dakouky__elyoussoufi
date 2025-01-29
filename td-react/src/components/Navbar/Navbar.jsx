// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { MdLogout } from 'react-icons/md';
const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClickOutside = (e) => {
    if (!e.target.closest('.user-section')) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:8010/auth/logout", {
        method: "GET",
        credentials: "include",
      });
  
      if (response.ok) {
        localStorage.removeItem("token");
        setUser(null);
        navigate('/login');
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <span className="material-icons">school</span>
          <span className="logo-text">Student Management</span>
        </div>

        <div className="navbar-links">
          {user ? (
            <div className="user-section">
              <div 
                className="user-profile"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="avatar-container">
                
                  <span className="online-status"></span>
                </div>
                <div className="user-info">
                  <span className="user-name">{user.firstName} {user.lastName}</span>
                  <span className="user-role">{user.role}</span>
                  <span className="user-email">{user.email}</span>
                </div>
              </div>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                   
                    <div className="dropdown-user-info">
                      <span className="dropdown-name">{user.firstName} {user.lastName}</span>
                      <span className="dropdown-role">{user.role}</span>
                      <span className="dropdown-email">{user.email}</span>

                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  
                  <button className="logout-button" onClick={logout}>
  <MdLogout size={24} /> Déconnexion
</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="login-button" onClick={() => navigate('/login')}>
                Connexion
              </button>
              <button className="register-button" onClick={() => navigate('/register')}>
                Inscription
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;