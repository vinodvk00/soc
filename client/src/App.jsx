import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from "./context/ProtectedRoute";
import HomePage from './pages/Home'
import UserManagement from './pages/UserManagement.jsx'
import IncidentLogin from './pages/IncidentLogin.jsx'
import Integration from './pages/Integration.jsx'
import IncidentReportManagement from './pages/IncidentReportManagement.jsx'
import DatabaseManagement from './pages/DatabaseManagement.jsx'
import FileUpload from './pages/FileUpload'
import Demo from './pages/Demo'
import Navbar from './components/Navbar'
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from './pages/Profile';
import AboutPage from './pages/AboutProject';
import Resources from './pages/Resourse';

function App() {
  return (
    <Router>
      <div className="cyber-guard-app">
        <Navbar />

        <main className="pt-16">
          <Routes>
            {/* Public Routes */}
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />

            {/* Protected Routes Wrapper */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/demo" element={<Demo />} />
                    <Route path="/user-management" element={<UserManagement />} />
                    <Route path="/aboutproject" element={<AboutPage />} />
                    <Route path="/res" element={<Resources />} />
                    <Route path="/incident-login" element={<IncidentLogin />} />
                    <Route path="/integration" element={<Integration />} />
                    <Route path="/incident-reports" element={<IncidentReportManagement />} />
                    <Route path="/database" element={<DatabaseManagement />} />
                    <Route path="/file-upload" element={<FileUpload />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App