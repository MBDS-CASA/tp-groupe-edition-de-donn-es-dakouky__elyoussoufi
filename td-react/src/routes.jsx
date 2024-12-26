import { Routes, Route } from "react-router-dom";
import App from "./App";
import DashboardComponent from './components/DashboardComponemnt';
import NotesComponent from './components/NotesComponent';
import StudentsComponent from './components/StudentsComponent';
import SubjectsComponent from './components/SubjectsComponent';
import AboutComponent from './components/AboutComponent';
import data from './data.json';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<DashboardComponent data={data} />} />
                <Route path="/dashboard" element={<DashboardComponent data={data} />} />
                <Route path="/notes" element={<NotesComponent data={data} />} />
                <Route path="/students" element={<StudentsComponent data={data} />} />
                <Route path="/subjects" element={<SubjectsComponent data={data} />} />
                <Route path="/about" element={<AboutComponent />} />
            </Route>
        </Routes>
    );
}