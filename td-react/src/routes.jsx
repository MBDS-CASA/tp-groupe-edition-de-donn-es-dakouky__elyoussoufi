//routes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import DashboardComponent from './components/DashboardComponemnt';
import NotesComponent from './components/NotesComponent';
import StudentsComponent from './components/StudentsComponent';
import SubjectsComponent from './components/SubjectsComponent';
import AboutComponent from './components/AboutComponent';
import EmailVerification from './components/Auth/EmailVerification';

export default function AppRoutes({ user, setUser }) {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/" /> : <Register />} 
      />
      <Route 
        path="/verify-email" 
        element={<EmailVerification />} 
      />
      <Route 
        path="/" 
        element={user ? <DashboardComponent user={user} /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/notes" 
        element={user ? <NotesComponent /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/students" 
        element={user ? <StudentsComponent /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/subjects" 
        element={user ? <SubjectsComponent /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/about" 
        element={user ? <AboutComponent /> : <Navigate to="/login" />} 
      />
    </Routes>
  );
}
