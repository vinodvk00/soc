import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home'
import UserManagement from './pages/UserManagement.jsx'
import IncidentLogin from './pages/IncidentLogin.jsx'
import Integration from './pages/Integration.jsx'
import IncidentReportManagement from './pages/IncidentReportManagement.jsx'
import DatabaseManagement from './pages/DatabaseManagement.jsx'
import FileUpload from './pages/FileUpload'
import Demo from './pages/Demo'

function App() {
  return (
    <Router>
      <div className="cyber-guard-app">
        {/* <header className="app-header">
          <h1>Cyber Guard</h1>
        </header> */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/incident-login" element={<IncidentLogin />} />
            <Route path="/integration" element={<Integration />} />
            <Route path="/incident-reports" element={<IncidentReportManagement />} />
            <Route path="/database" element={<DatabaseManagement />} />
            <Route path="/file-upload" element={<FileUpload />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App