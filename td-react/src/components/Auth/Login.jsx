// src/components/Auth/Login.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';
import Google from "../../assets/img/google.png";
import Github from "../../assets/img/github.png";
import LinkedIn from "../../assets/img/linkedin.png";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
  
    try {
      const response = await fetch('http://localhost:8010/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          // Retirez 'Authorization' s'il n'est pas nécessaire pour le login
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      
      if (data.user && data.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        navigate('/');
      } else {
        setMessage('Erreur de connexion : réponse invalide du serveur');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setMessage('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  const google = () => {
    window.open("http://localhost:8010/auth/google", "_self");
  };

  const github = () => {
    window.open("http://localhost:8010/auth/github", "_self");
  };

  const linkedin = () => {
    window.open("http://localhost:8010/auth/linkedin", "_self");
  };

  return (
    <div className="login">
      <h1 className="loginTitle">Choose a Login Method</h1>
      {message && <div className="message">{message}</div>}
      <div className="wrapper">
        <div className="left">
          <div className="loginButton google" onClick={google}>
            <img src={Google} alt="Google" className="icon" />
            Google
          </div>
          <div className="loginButton github" onClick={github}>
            <img src={Github} alt="Github" className="icon" />
            Github
          </div>
          <div className="loginButton linkedin" onClick={linkedin}>
            <img src={LinkedIn} alt="LinkedIn" className="icon" />
            LinkedIn
          </div>
        </div>
        <div className="center">
          <div className="line" />
          <div className="or">OR</div>
        </div>
        <div className="right">
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button type="submit" className="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;