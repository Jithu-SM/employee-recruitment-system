import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Brain,
  Users,
  Briefcase,
  FileText,
  ClipboardList,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
} from "lucide-react";
import "./styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [activeSection, setActiveSection] = useState("users");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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

  // Toggle dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setDarkMode(savedTheme === "dark");
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleDarkMode = () => {
    const newTheme = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

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

  const navItems = [
    { id: "users", label: "Users", icon: Users, count: users.length },
    { id: "jobs", label: "Jobs", icon: Briefcase, count: jobs.length },
    { id: "applications", label: "Applications", icon: ClipboardList, count: applications.length },
    { id: "resumes", label: "Resumes", icon: FileText, count: resumes.length },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "users":
        return (
          <div className="admin-section">
            <div className="section-header">
              <h3 className="section-title">
                <Users size={28} />
                Users Management
              </h3>
              <button 
                className="btn btn-primary" 
                onClick={() => setEditing({ type: "users", data: {}, isNew: true })}
              >
                <Plus size={18} />
                Add User
              </button>
            </div>
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
            <ul className="data-table">
              {getFilteredUsers().map((user) => (
                <li key={user.id} className="data-row">
                  <div className="row-header">
                    <span className="row-title">{user.username}</span>
                    {user.user_type === "recruiter" && (
                      <span className={`status-badge ${user.is_approved ? "approved" : "pending"}`}>
                        {user.is_approved ? "Approved" : "Pending"}
                      </span>
                    )}
                  </div>
                  <p className="row-meta">{user.email} • Role: {user.user_type}</p>
                  <div className="actions">
                    {user.user_type === "recruiter" && !user.is_approved && (
                      <button
                        className="btn btn-success"
                        onClick={async () => {
                          await axios.post(
                            `http://127.0.0.1:8000/api/admin/users/${user.id}/approve/`,
                            {},
                            { headers }
                          );
                          fetchData();
                        }}
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                    )}
                    <button className="btn btn-info" onClick={() => setViewing({ type: "users", data: user })}>
                      <Eye size={16} />
                      View
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditing({ type: "users", data: user, isNew: false })}>
                      <Edit size={16} />
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete("users", user.id)}>
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="pagination">
              <button disabled={userPage === 1} onClick={() => setUserPage(userPage - 1)}>
                <ChevronLeft size={18} /> Prev
              </button>
              <span>Page {userPage} of {totalUserPages || 1}</span>
              <button
                disabled={userPage === totalUserPages || totalUserPages === 0}
                onClick={() => setUserPage(userPage + 1)}
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          </div>
        );

      case "jobs":
        return (
          <div className="admin-section">
            <div className="section-header">
              <h3 className="section-title">
                <Briefcase size={28} />
                Jobs Management
              </h3>
              <button 
                className="btn btn-primary" 
                onClick={() => setEditing({ type: "jobs", data: {}, isNew: true })}
              >
                <Plus size={18} />
                Add Job
              </button>
            </div>
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
            <ul className="data-table">
              {getFilteredJobs().map((job) => (
                <li key={job.id} className="data-row">
                  <div className="row-header">
                    <span className="row-title">{job.title}</span>
                  </div>
                  <p className="row-meta">{job.company} • {job.location}</p>
                  <div className="actions">
                    <button className="btn btn-info" onClick={() => setViewing({ type: "jobs", data: job })}>
                      <Eye size={16} />
                      View
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditing({ type: "jobs", data: job, isNew: false })}>
                      <Edit size={16} />
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete("jobs", job.id)}>
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="pagination">
              <button disabled={jobPage === 1} onClick={() => setJobPage(jobPage - 1)}>
                <ChevronLeft size={18} /> Prev
              </button>
              <span>Page {jobPage} of {totalJobPages || 1}</span>
              <button
                disabled={jobPage === totalJobPages || totalJobPages === 0}
                onClick={() => setJobPage(jobPage + 1)}
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          </div>
        );

      case "applications":
        return (
          <div className="admin-section">
            <div className="section-header">
              <h3 className="section-title">
                <ClipboardList size={28} />
                Applications Management
              </h3>
            </div>
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
            <ul className="data-table">
              {getFilteredApps().map((app) => (
                <li key={app.id} className="data-row">
                  <div className="row-header">
                    <span className="row-title">{app.user?.username} → {app.job?.title}</span>
                    <span className={`status-badge ${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="row-meta">{app.job?.company} • Match Score: {app.match_score}%</p>
                  <div className="actions">
                    <button className="btn btn-info" onClick={() => setViewing({ type: "applications", data: app })}>
                      <Eye size={16} />
                      View
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditing({ type: "applications", data: app, isNew: false })}>
                      <Edit size={16} />
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete("applications", app.id)}>
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="pagination">
              <button disabled={appPage === 1} onClick={() => setAppPage(appPage - 1)}>
                <ChevronLeft size={18} /> Prev
              </button>
              <span>Page {appPage} of {totalAppPages || 1}</span>
              <button
                disabled={appPage === totalAppPages || totalAppPages === 0}
                onClick={() => setAppPage(appPage + 1)}
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          </div>
        );

      case "resumes":
        return (
          <div className="admin-section">
            <div className="section-header">
              <h3 className="section-title">
                <FileText size={28} />
                Resumes Management
              </h3>
            </div>
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
            <ul className="data-table">
              {getFilteredResumes().map((resume) => (
                <li key={resume.id} className="data-row">
                  <div className="row-header">
                    <span className="row-title">{resume.user?.username || "Unknown"}</span>
                  </div>
                  <p className="row-meta">
                    <a href={resume.file} target="_blank" rel="noreferrer" style={{color: 'var(--primary-color)'}}>
                      View Resume PDF
                    </a>
                  </p>
                  <div className="actions">
                    <button className="btn btn-info" onClick={() => alert(JSON.stringify(resume, null, 2))}>
                      <Eye size={16} />
                      View Details
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete("resumes", resume.id)}>
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="pagination">
              <button disabled={resumePage === 1} onClick={() => setResumePage(resumePage - 1)}>
                <ChevronLeft size={18} /> Prev
              </button>
              <span>Page {resumePage} of {totalResumePages || 1}</span>
              <button
                disabled={resumePage === totalResumePages || totalResumePages === 0}
                onClick={() => setResumePage(resumePage + 1)}
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Brain size={24} />
          </div>
          <span className="sidebar-brand">RecruitAI</span>
        </div>
        <button 
          className="sidebar-toggle" 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => setActiveSection(item.id)}
            >
              <item.icon className="nav-icon" />
              <span className="nav-text">{item.label}</span>
              <span className="nav-badge">{item.count}</span>
            </div>
          ))}
        </nav>
        <div className="sidebar-logout">
          <div
            className={`nav-item logout-nav-item${sidebarCollapsed ? " collapsed" : ""}`}
            onClick={handleLogout}
            title="Logout"
            style={{ color: "var(--danger)" }}
          >
            <LogOut className="nav-icon" />
            {!sidebarCollapsed && <span className="nav-text">Logout</span>}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="header-left">
            <h1 className="page-title">
              {navItems.find(item => item.id === activeSection)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="header-right">
            <button className="theme-toggle" onClick={toggleDarkMode}>
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <div className="user-profile">
              <div className="user-avatar">A</div>
              <div className="user-info">
                <div className="user-name">Admin</div>
                <div className="user-role">Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Stats */}
        <div className="admin-content">
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon users">
                  <Users size={24} />
                </div>
              </div>
              <div className="stat-value">{users.length}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon jobs">
                  <Briefcase size={24} />
                </div>
              </div>
              <div className="stat-value">{jobs.length}</div>
              <div className="stat-label">Active Jobs</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon applications">
                  <ClipboardList size={24} />
                </div>
              </div>
              <div className="stat-value">{applications.length}</div>
              <div className="stat-label">Applications</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon resumes">
                  <FileText size={24} />
                </div>
              </div>
              <div className="stat-value">{resumes.length}</div>
              <div className="stat-label">Resumes</div>
            </div>
          </div>

          {/* Active Section Content */}
          {renderSection()}
        </div>
      </main>

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
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
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
            <button className="btn btn-primary" onClick={() => setViewing(null)}>Close</button>
          </div>
        </div>
      )}


    </div>
  );
};

export default AdminDashboard;