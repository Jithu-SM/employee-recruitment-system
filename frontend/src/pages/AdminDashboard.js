import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  // Pagination & search state for each section
  const [userPage, setUserPage] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [userSort, setUserSort] = useState("username");

  const [jobPage, setJobPage] = useState(1);
  const [jobSearch, setJobSearch] = useState("");
  const [jobSort, setJobSort] = useState("title");

  const [appPage, setAppPage] = useState(1);
  const [appSearch, setAppSearch] = useState("");
  const [appSort, setAppSort] = useState("status");

  const [resumePage, setResumePage] = useState(1);
  const [resumeSearch, setResumeSearch] = useState("");
  const [resumeSort, setResumeSort] = useState("id");

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

  // USERS
  const getFilteredUsers = () => {
    let filtered = users.filter(
      (u) =>
        u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
    );
    filtered = filtered.sort((a, b) =>
      (a[userSort] || "").toString().localeCompare((b[userSort] || "").toString())
    );
    const start = (userPage - 1) * 10;
    const end = start + 10;
    return filtered.slice(start, end);
  };
  const totalUserPages = Math.ceil(
    users.filter(
      (u) =>
        u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
    ).length / 10
  );

  // JOBS
  const getFilteredJobs = () => {
    let filtered = jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
        j.company?.toLowerCase().includes(jobSearch.toLowerCase())
    );
    filtered = filtered.sort((a, b) =>
      (a[jobSort] || "").toString().localeCompare((b[jobSort] || "").toString())
    );
    const start = (jobPage - 1) * 10;
    const end = start + 10;
    return filtered.slice(start, end);
  };
  const totalJobPages = Math.ceil(
    jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
        j.company?.toLowerCase().includes(jobSearch.toLowerCase())
    ).length / 10
  );

  // APPLICATIONS
  const getFilteredApps = () => {
    let filtered = applications.filter(
      (a) =>
        (a.user?.username || "").toLowerCase().includes(appSearch.toLowerCase()) ||
        (a.job?.title || "").toLowerCase().includes(appSearch.toLowerCase())
    );
    filtered = filtered.sort((a, b) =>
      (a[appSort] || "").toString().localeCompare((b[appSort] || "").toString())
    );
    const start = (appPage - 1) * 10;
    const end = start + 10;
    return filtered.slice(start, end);
  };
  const totalAppPages = Math.ceil(
    applications.filter(
      (a) =>
        (a.user?.username || "").toLowerCase().includes(appSearch.toLowerCase()) ||
        (a.job?.title || "").toLowerCase().includes(appSearch.toLowerCase())
    ).length / 10
  );

  // RESUMES
  const getFilteredResumes = () => {
    let filtered = resumes.filter(
      (r) =>
        (r.user?.username || "").toLowerCase().includes(resumeSearch.toLowerCase())
    );
    filtered = filtered.sort((a, b) =>
      (a[resumeSort] || "").toString().localeCompare((b[resumeSort] || "").toString())
    );
    const start = (resumePage - 1) * 10;
    const end = start + 10;
    return filtered.slice(start, end);
  };
  const totalResumePages = Math.ceil(
    resumes.filter(
      (r) =>
        (r.user?.username || "").toLowerCase().includes(resumeSearch.toLowerCase())
    ).length / 10
  );

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure?")) return;
    await axios.delete(`http://127.0.0.1:8000/api/admin/${type}/${id}/`, { headers });
    fetchData();
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

      {/* USERS Section */}
      <section>
        <h3>👥 Users</h3>
        <div className="controls">
          <input
            type="text"
            placeholder="Search users..."
            value={userSearch}
            onChange={(e) => {
              setUserPage(1);
              setUserSearch(e.target.value);
            }}
          />
          <select value={userSort} onChange={(e) => setUserSort(e.target.value)}>
            <option value="username">Sort by Username</option>
            <option value="email">Sort by Email</option>
            <option value="user_type">Sort by Role</option>
          </select>
        </div>
        <button onClick={() => setEditing({ type: "users", data: {}, isNew: true })}>
          ➕ Add User
        </button>
        <ul>
          {getFilteredUsers().map((user) => (
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
        <div className="pagination">
          <button disabled={userPage === 1} onClick={() => setUserPage(userPage - 1)}>
            ⬅ Prev
          </button>
          <span>
            Page {userPage} of {totalUserPages || 1}
          </span>
          <button
            disabled={userPage === totalUserPages || totalUserPages === 0}
            onClick={() => setUserPage(userPage + 1)}
          >
            Next ➡
          </button>
        </div>
      </section>

      {/* JOBS Section */}
      <section>
        <h3>💼 Jobs</h3>
        <div className="controls">
          <input
            type="text"
            placeholder="Search jobs..."
            value={jobSearch}
            onChange={(e) => {
              setJobPage(1);
              setJobSearch(e.target.value);
            }}
          />
          <select value={jobSort} onChange={(e) => setJobSort(e.target.value)}>
            <option value="title">Sort by Title</option>
            <option value="company">Sort by Company</option>
            <option value="location">Sort by Location</option>
          </select>
        </div>
        <button onClick={() => setEditing({ type: "jobs", data: {}, isNew: true })}>
          ➕ Add Job
        </button>
        <ul>
          {getFilteredJobs().map((job) => (
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
        <div className="pagination">
          <button disabled={jobPage === 1} onClick={() => setJobPage(jobPage - 1)}>
            ⬅ Prev
          </button>
          <span>
            Page {jobPage} of {totalJobPages || 1}
          </span>
          <button
            disabled={jobPage === totalJobPages || totalJobPages === 0}
            onClick={() => setJobPage(jobPage + 1)}
          >
            Next ➡
          </button>
        </div>
      </section>

      {/* APPLICATIONS Section */}
      <section>
        <h3>📌 Applications</h3>
        <div className="controls">
          <input
            type="text"
            placeholder="Search applications..."
            value={appSearch}
            onChange={(e) => {
              setAppPage(1);
              setAppSearch(e.target.value);
            }}
          />
          <select value={appSort} onChange={(e) => setAppSort(e.target.value)}>
            <option value="status">Sort by Status</option>
            <option value="match_score">Sort by Match Score</option>
          </select>
        </div>
        <ul>
          {getFilteredApps().map((app) => (
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
        <div className="pagination">
          <button disabled={appPage === 1} onClick={() => setAppPage(appPage - 1)}>
            ⬅ Prev
          </button>
          <span>
            Page {appPage} of {totalAppPages || 1}
          </span>
          <button
            disabled={appPage === totalAppPages || totalAppPages === 0}
            onClick={() => setAppPage(appPage + 1)}
          >
            Next ➡
          </button>
        </div>
      </section>

      {/* RESUMES Section */}
      <section>
        <h3>📄 Resumes</h3>
        <div className="controls">
          <input
            type="text"
            placeholder="Search resumes..."
            value={resumeSearch}
            onChange={(e) => {
              setResumePage(1);
              setResumeSearch(e.target.value);
            }}
          />
          <select value={resumeSort} onChange={(e) => setResumeSort(e.target.value)}>
            <option value="id">Sort by ID</option>
            <option value="user">Sort by User</option>
          </select>
        </div>
        <ul>
          {getFilteredResumes().map(resume => (
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
        <div className="pagination">
          <button disabled={resumePage === 1} onClick={() => setResumePage(resumePage - 1)}>
            ⬅ Prev
          </button>
          <span>
            Page {resumePage} of {totalResumePages || 1}
          </span>
          <button
            disabled={resumePage === totalResumePages || totalResumePages === 0}
            onClick={() => setResumePage(resumePage + 1)}
          >
            Next ➡
          </button>
        </div>
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
                // handleSave(editing.type, { ...editing.data, ...formData }, editing.isNew);
                // You can implement handleSave as in your original code
                alert("Save not implemented in this snippet.");
              }}
            >
              {formFields[editing.type]?.map((field) => (
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