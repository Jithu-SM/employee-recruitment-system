import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [editing, setEditing] = useState(null); // {type, data}
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch all data
  const fetchData = async () => {
    const [usersRes, jobsRes, resumesRes, appsRes] = await Promise.all([
      axios.get("http://127.0.0.1:8000/api/admin/users/", { headers }),
      axios.get("http://127.0.0.1:8000/api/admin/jobs/", { headers }),
      axios.get("http://127.0.0.1:8000/api/admin/resumes/", { headers }),
      axios.get("http://127.0.0.1:8000/api/admin/applications/", { headers }),
    ]);
    setUsers(usersRes.data);
    setJobs(jobsRes.data);
    setResumes(resumesRes.data);
    setApplications(appsRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  // Delete
  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure?")) return;
    await axios.delete(`http://127.0.0.1:8000/api/admin/${type}/${id}/`, { headers });
    fetchData();
  };

  // Save Edit
  const handleSave = async (type, data) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/admin/${type}/${data.id}/`, data, { headers });
      setEditing(null);
      fetchData();
    } catch (err) {
      alert("Failed to update " + type);
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
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <b>{user.username}</b> ({user.email}) - Role: {user.user_type}
              <div className="actions">
                <button onClick={() => setEditing({ type: "users", data: user })}>Edit</button>
                <button onClick={() => handleDelete("users", user.id)}>Delete</button>
              </div>
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
              <b>{job.title}</b> - {job.company} ({job.location})
              <div className="actions">
                <button onClick={() => setEditing({ type: "jobs", data: job })}>Edit</button>
                <button onClick={() => handleDelete("jobs", job.id)}>Delete</button>
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
              <p>Status: {app.status} | Match: {app.match_score}%</p>
              <div className="actions">
                <button onClick={() => setEditing({ type: "applications", data: app })}>Edit</button>
                <button onClick={() => handleDelete("applications", app.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Edit Modal */}
      {editing && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit {editing.type}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = Object.fromEntries(new FormData(e.target));
                handleSave(editing.type, { ...editing.data, ...formData });
              }}
            >
              {Object.keys(editing.data).map(key => (
                <div key={key}>
                  <label>{key}:</label>
                  <input name={key} defaultValue={editing.data[key]} />
                </div>
              ))}
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditing(null)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
};

export default AdminDashboard;
