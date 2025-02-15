import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Navigation Bar */}
      <nav className="bg-blue-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Cyber Guard</Link>
          <div className="space-x-6">
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/file-upload" className="hover:underline">Analyze Files</Link>
            <Link to="/incident-login" className="hover:underline">Report Incident</Link>
            <Link to="/" className="hover:underline">Logout</Link>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-12 text-center">Welcome, User!</h1>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* File Analysis Card */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">File Analysis</h2>
            <p className="text-gray-300 mb-6 text-center">
              Upload and analyze files (DLLs, EXEs, PDFs) for potential threats.
            </p>
            <div className="flex justify-center">
              <Link to="/file-upload" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300">
                Analyze Files
              </Link>
            </div>
          </div>

          {/* Incident Reporting Card */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">Incident Reporting</h2>
            <p className="text-gray-300 mb-6 text-center">
              Report security incidents with severity levels (High, Medium, Low).
            </p>
            <div className="flex justify-center">
              <Link to="/incident-login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300">
                Report Incident
              </Link>
            </div>
          </div>

          {/* View Incidents Card */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">View Incidents</h2>
            <p className="text-gray-300 mb-6 text-center">
              Track and manage all reported security incidents.
            </p>
            <div className="flex justify-center">
              <Link to="/incident-reports" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300">
                View Incidents
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Recent Activity</h2>
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left py-3 px-6 border-b border-gray-600">Date</th>
                  <th className="text-left py-3 px-6 border-b border-gray-600">Activity</th>
                  <th className="text-left py-3 px-6 border-b border-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-6">06-01-2025</td>
                  <td className="py-3 px-6">File Analysis: 7z2301-x64.exe</td>
                  <td className="py-3 px-6 text-green-400">Completed</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-6">06-01-2025</td>
                  <td className="py-3 px-6">Incident Reported: Suspicious Activity</td>
                  <td className="py-3 px-6 text-yellow-400">Pending</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-6">06-01-2025</td>
                  <td className="py-3 px-6">File Analysis: OSCP.pdf</td>
                  <td className="py-3 px-6 text-green-400">Completed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;