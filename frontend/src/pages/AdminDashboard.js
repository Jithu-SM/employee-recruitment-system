import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [editing, setEditing] = useState(null); // {type, data, isNew}
  const [viewing, setViewing] = useState(null); // {type, data}
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure?")) return;
    await axios.delete(`http://127.0.0.1:8000/api/admin/${type}/${id}/`, { headers });
    fetchData();
  };

  const handleSave = async (type, data, isNew) => {
    try {
      if (isNew) {
        await axios.post(`http://127.0.0.1:8000/api/admin/${type}/`, data, { headers });
      } else {
        await axios.put(`http://127.0.0.1:8000/api/admin/${type}/${data.id}/`, data, { headers });
      }
      setEditing(null);
      fetchData();
    } catch (err) {
      alert("Failed to save " + type);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Fields per type
  const formFields = {
    users: ["username", "email", "user_type"],
    jobs: ["title", "company", "location", "description", "skills_required"],
    applications: ["status"],
  };

  // Dropdown options
  const dropdownOptions = {
    user_type: ["admin", "recruiter", "candidate"],
    status: ["Pending", "Shortlisted", "Rejected", "Hired"],
  };

  const renderField = (field, value) => {
    if (dropdownOptions[field]) {
      return (
        <select name={field} defaultValue={value || ""} required>
          <option value="">Select {field}</option>
          {dropdownOptions[field].map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }
    return <input name={field} defaultValue={value || ""} required={field !== "status"} />;
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/* Users */}
      <section>
        <h3>👥 Users</h3>
        <button onClick={() => setEditing({ type: "users", data: {}, isNew: true })}>
          ➕ Add User
        </button>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <b>{user.username}</b> ({user.email}) - Role: {user.user_type}
              <div className="actions">
                <button onClick={() => setViewing({ type: "users", data: user })}>View</button>
                <button onClick={() => setEditing({ type: "users", data: user, isNew: false })}>
                  Edit
                </button>
                <button onClick={() => handleDelete("users", user.id)}>Delete</button>
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


      {/* Jobs */}
      <section>
        <h3>💼 Jobs</h3>
        <button onClick={() => setEditing({ type: "jobs", data: {}, isNew: true })}>
          ➕ Add Job
        </button>
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <b>{job.title}</b> - {job.company} ({job.location})
              <div className="actions">
                <button onClick={() => setViewing({ type: "jobs", data: job })}>View</button>
                <button onClick={() => setEditing({ type: "jobs", data: job, isNew: false })}>
                  Edit
                </button>
                <button onClick={() => handleDelete("jobs", job.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Applications */}
      <section>
        <h3>📌 Applications</h3>
        <ul>
          {applications.map((app) => (
            <li key={app.id}>
              <b>{app.user?.username}</b> → {app.job?.title} @ {app.job?.company}
              <p>Status: {app.status} | Match: {app.match_score}%</p>
              <div className="actions">
                <button onClick={() => setViewing({ type: "applications", data: app })}>View</button>
                <button onClick={() => setEditing({ type: "applications", data: app, isNew: false })}>
                  Edit
                </button>
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
            <h3>
              {editing.isNew ? "Add" : "Edit"} {editing.type.slice(0, -1).toUpperCase()}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = Object.fromEntries(new FormData(e.target));
                handleSave(editing.type, { ...editing.data, ...formData }, editing.isNew);
              }}
            >
              {formFields[editing.type].map((field) => (
                <div key={field}>
                  <label>{field}:</label>
                  {renderField(field, editing.data[field])}
                </div>
              ))}
              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditing(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewing && (
        <div className="modal">
          <div className="modal-content">
            <h3>Details</h3>

            {viewing.type === "users" && (
              <div>
                <p><b>Username:</b> {viewing.data.username}</p>
                <p><b>Email:</b> {viewing.data.email}</p>
                <p><b>Role:</b> {viewing.data.user_type}</p>
              </div>
            )}

            {viewing.type === "jobs" && (
              <div>
                <p><b>Title:</b> {viewing.data.title}</p>
                <p><b>Company:</b> {viewing.data.company}</p>
                <p><b>Location:</b> {viewing.data.location}</p>
                <p><b>Description:</b> {viewing.data.description}</p>
                <p><b>Skills Required:</b> {viewing.data.skills_required}</p>
              </div>
            )}

            {viewing.type === "applications" && (
              <div>
                <p><b>Candidate:</b> {viewing.data.user?.username}</p>
                <p><b>Job:</b> {viewing.data.job?.title} @ {viewing.data.job?.company}</p>
                <p><b>Status:</b> {viewing.data.status}</p>
                <p><b>Match Score:</b> {viewing.data.match_score}%</p>
                {viewing.data.recruiter_message && (
                  <p><b>Message from Recruiter:</b> {viewing.data.recruiter_message}</p>
                )}
                <p><b>Applied On:</b> {new Date(viewing.data.created_at).toLocaleString()}</p>
              </div>
            )}

            <button onClick={() => setViewing(null)}>Close</button>
          </div>
        </div>
      )}

      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
};

export default AdminDashboard;
