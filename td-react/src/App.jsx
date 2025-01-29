import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import DashboardComponent from './components/drawer/DashboardComponemnt';
import NotesComponent from './components/drawer/NotesComponent';
import StudentsComponent from './components/drawer/StudentsComponent';
import SubjectsComponent from './components/drawer/SubjectsComponent';
import AboutComponent from './components/drawer/AboutComponent';
import DrawerComponent from './components/drawer/DrawerComponent';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    const getUser = async () => {
      try {
        const response = await fetch("http://localhost:8010/auth/login/success", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Authentication failed!");
        }

        const resObject = await response.json();
        setUser(resObject.user);
      } catch (err) {
        console.log(err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar user={user} />
      <Routes>
        {/* Authenticated routes */}
        {user ? (
          <>

  
<Route path="*" element={<DrawerComponent user={user} />} />
          </>
        ) : (
          // Unauthenticated routes
          <>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
