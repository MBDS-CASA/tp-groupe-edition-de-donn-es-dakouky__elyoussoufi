// src/components/Navbar/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const logout = () => {
    window.open("http://localhost:8010/auth/logout", "_self");
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <span className="logo" onClick={() => navigate('/')}>
          Student Management
        </span>
      </div>
      <div className="navbar-links">
        {user ? (
          <div className="navbar-user">
            <img src={user.profilePicture || '/default-avatar.png'} alt="" className="navbar-avatar" />
            <span className="navbar-username">{user.firstName}</span>
            <button className="logout-button" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="login-button" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="register-button" onClick={() => navigate('/register')}>
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;