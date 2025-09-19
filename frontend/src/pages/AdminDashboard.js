import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    axios.get("http://127.0.0.1:8000/api/admin/users/", { headers }).then(res => setUsers(res.data));
    axios.get("http://127.0.0.1:8000/api/admin/jobs/", { headers }).then(res => setJobs(res.data));
    axios.get("http://127.0.0.1:8000/api/admin/resumes/", { headers }).then(res => setResumes(res.data));
    axios.get("http://127.0.0.1:8000/api/admin/applications/", { headers }).then(res => setApplications(res.data));
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/* Users Section */}
      <section>
        <h3>👥 Users</h3>
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.username} ({user.email}) - Role: {user.user_type}
            </li>
          ))}
        </ul>
      </section>

      {/* Jobs Section */}
      <section>
        <h3>💼 Jobs</h3>
        <ul>
          {jobs.map(job => (
            <li key={job.id}>
              {job.title} - {job.company} ({job.location})
            </li>
          ))}
        </ul>
      </section>

      {/* Resumes Section */}
      <section>
        <h3>📄 Resumes</h3>
        <ul>
          {resumes.map(resume => (
            <li key={resume.id}>
              {resume.user?.username || "Unknown"} - <a href={resume.file} target="_blank" rel="noreferrer">View Resume</a>
            </li>
          ))}
        </ul>
      </section>

      {/* Applications Section */}
      <section>
        <h3>📌 Applications</h3>
        <ul>
          {applications.map(app => (
            <li key={app.id}>
              {app.user?.username} → {app.job} | Status: {app.status} | Match: {app.match_score}%
            </li>
          ))}
        </ul>
      </section>

      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
};

export default AdminDashboard;
