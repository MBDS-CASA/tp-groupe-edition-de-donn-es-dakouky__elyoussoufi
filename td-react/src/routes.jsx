//routes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import DashboardComponent from './components/drawer/DashboardComponemnt';
import NotesComponent from './components/drawer/NotesComponent';
import StudentsComponent from './components/drawer/StudentsComponent';
import SubjectsComponent from './components/drawer/SubjectsComponent';
import AboutComponent from './components/drawer/AboutComponent';
import EmailVerification from './components/Auth/EmailVerification';
import DrawerComponent from './components/drawer/DrawerComponent';
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
      <Route 
  path="/dashboard" 
  element={user ? <DashboardComponent user={user} /> : <Navigate to="/login" />} 
/>
<Route 
  path="/login" 
  element={user ? <Login  /> : <Navigate to="/login" />} 
/>



    </Routes>
  );
}
