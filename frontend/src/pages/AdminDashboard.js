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
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/admin/users/", { headers }).then(res => setUsers(res.data));
    axios.get("http://127.0.0.1:8000/api/admin/jobs/", { headers }).then(res => setJobs(res.data));
    axios.get("http://127.0.0.1:8000/api/admin/resumes/", { headers }).then(res => setResumes(res.data));
    axios.get("http://127.0.0.1:8000/api/admin/applications/", { headers }).then(res => setApplications(res.data));
  }, []);

  // Example handlers (implement API calls)
  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/admin/${type}/${id}/`, { headers });
      alert(`${type} deleted successfully`);
      window.location.reload();
    } catch (err) {
      alert("Failed to delete " + type);
    }
  };

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
        <button className="create-btn">+ Create User</button>
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <b>{user.username}</b> ({user.email}) - Role: {user.user_type}
              <div className="actions">
                <button onClick={() => alert(JSON.stringify(user, null, 2))}>View</button>
                <button>Edit</button>
                <button onClick={() => handleDelete("users", user.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Jobs Section */}
      <section>
        <h3>💼 Jobs</h3>
        <button className="create-btn">+ Create Job</button>
        <ul>
          {jobs.map(job => (
            <li key={job.id}>
              <b>{job.title}</b> - {job.company} ({job.location})
              <div className="actions">
                <button onClick={() => alert(JSON.stringify(job, null, 2))}>View</button>
                <button>Edit</button>
                <button onClick={() => handleDelete("jobs", job.id)}>Delete</button>
              </div>
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
              {resume.user?.username || "Unknown"} - 
              <a href={resume.file} target="_blank" rel="noreferrer">View Resume</a>
              <div className="actions">
                <button onClick={() => alert(JSON.stringify(resume, null, 2))}>View</button>
                <button onClick={() => handleDelete("resumes", resume.id)}>Delete</button>
              </div>
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
              <b>{app.user?.username}</b> → {app.job?.title || app.job} @ {app.job?.company || ""}
              <p>Status: <span className={`status ${app.status.toLowerCase()}`}>{app.status}</span> | Match: {app.match_score}%</p>
              <div className="actions">
                <button onClick={() => alert(JSON.stringify(app, null, 2))}>View</button>
                <button>Edit</button>
                <button onClick={() => handleDelete("applications", app.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
};

export default AdminDashboard;
