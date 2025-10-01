import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRecruiterJobs, postJob, fetchApplicants } from "../services/api";
import axios from "axios";
import {
  Brain,
  Home,
  Briefcase,
  Users,
  PlusCircle,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building,
  Target,
  FileText,
  Send,
} from "lucide-react";
import "./styles/RecruiterDashboard.css";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [showApplicants, setShowApplicants] = useState(null);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    skills_required: "",
  });
  const [messages, setMessages] = useState({});
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  // Theme setup
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

  // Decode JWT for username
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUsername(payload.username || payload.user_name || "");
      } catch {
        setUsername("");
      }
    }
  }, []);

  // Fetch recruiter jobs
  useEffect(() => {
    fetchRecruiterJobs().then(res => setJobs(res.data)).catch(console.error);
  }, []);

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      await postJob(newJob);
      alert("✅ Job posted successfully!");
      setNewJob({ title: "", description: "", company: "", location: "", skills_required: "" });
      fetchRecruiterJobs().then(res => setJobs(res.data));
      setActiveSection("jobs");
    } catch {
      alert("❌ Failed to post job.");
    }
  };

  const handleViewApplicants = async (jobId) => {
    try {
      const res = await fetchApplicants(jobId);
      let apps = [];
      if (Array.isArray(res.data)) {
        apps = res.data;
      } else if (res.data && typeof res.data === "object") {
        apps = [res.data];
      }
      apps.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
      setApplicants(apps);
      setShowApplicants(jobId);
      setActiveSection("applicants");
    } catch {
      alert("❌ Could not fetch applicants.");
    }
  };

  const handleUpdateStatus = async (appId, newStatus, recruiterMessage) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://127.0.0.1:8000/api/applications/${appId}/`,
        { status: newStatus, recruiter_message: recruiterMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplicants(prev =>
        prev.map(app =>
          app.id === appId
            ? { ...app, status: newStatus, recruiter_message: recruiterMessage }
            : app
        )
      );
      alert("✅ Status updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update status.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "postJob", label: "Post Job", icon: PlusCircle },
    { id: "jobs", label: "My Jobs", icon: Briefcase, badge: jobs.length },
    { id: "applicants", label: "Applicants", icon: Users },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <>
            {/* Stats */}
            <div className="dashboard-section">
              <div className="section-header">
                <h3 className="section-title"><Home /> Dashboard Overview</h3>
              </div>
              <div className="jobs-grid">
                <div className="job-card" style={{ borderLeft: "4px solid var(--primary-color)" }}>
                  <h4 className="job-card-title">{jobs.length}</h4>
                  <p className="job-card-description">Total Jobs Posted</p>
                </div>
                <div className="job-card" style={{ borderLeft: "4px solid var(--success)" }}>
                  <h4 className="job-card-title">
                    {jobs.reduce((acc, job) => acc + (job.applicant_count || 0), 0)}
                  </h4>
                  <p className="job-card-description">Total Applications</p>
                </div>
              </div>
            </div>

            {/* Recent Jobs */}
            <div className="dashboard-section">
              <div className="section-header">
                <h3 className="section-title"><Briefcase /> Recent Jobs</h3>
              </div>
              {jobs.length > 0 ? (
                <div className="jobs-grid">
                  {jobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="job-card">
                      <h4 className="job-card-title">{job.title}</h4>
                      <div className="job-meta">
                        <span className="job-meta-item"><Building size={16} /> {job.company}</span>
                        <span className="job-meta-item"><MapPin size={16} /> {job.location}</span>
                      </div>
                      <button className="btn btn-info" onClick={() => handleViewApplicants(job.id)}>
                        <Users size={18} /> View Applicants
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Briefcase className="empty-state-icon" />
                  <p>No jobs posted yet. Create your first job!</p>
                </div>
              )}
            </div>
          </>
        );

      case "postJob":
        return (
          <div className="dashboard-section">
            <div className="section-header">
              <h3 className="section-title"><PlusCircle /> Post New Job</h3>
            </div>
            <form className="job-form" onSubmit={handlePostJob}>
              <div className="form-row">
                <input type="text" placeholder="Job Title *" value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} required />
                <input type="text" placeholder="Company Name" value={newJob.company}
                  onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} />
              </div>
              <input type="text" placeholder="Location" value={newJob.location}
                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} />
              <textarea placeholder="Job Description *" value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} required />
              <input type="text" placeholder="Required Skills" value={newJob.skills_required}
                onChange={(e) => setNewJob({ ...newJob, skills_required: e.target.value })} />
              <button type="submit" className="btn btn-primary"><Send size={18} /> Post Job</button>
            </form>
          </div>
        );

      case "jobs":
        return (
          <div className="dashboard-section">
            <div className="section-header">
              <h3 className="section-title"><Briefcase /> My Posted Jobs</h3>
            </div>
            {jobs.length > 0 ? (
              <div className="jobs-grid">
                {jobs.map((job) => (
                  <div key={job.id} className="job-card">
                    <h4 className="job-card-title">{job.title}</h4>
                    <div className="job-meta">
                      <span className="job-meta-item"><Building size={16} /> {job.company}</span>
                      <span className="job-meta-item"><MapPin size={16} /> {job.location}</span>
                    </div>
                    <button className="btn btn-info" onClick={() => handleViewApplicants(job.id)}>
                      <Users size={18} /> View Applicants
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Briefcase className="empty-state-icon" />
                <p>No jobs yet. Post one!</p>
              </div>
            )}
          </div>
        );

      case "applicants":
        return (
          <div className="dashboard-section">
            <div className="section-header">
              <h3 className="section-title"><Users /> Applicants</h3>
            </div>
            {applicants.length > 0 ? (
              <ul className="applicants-list">
                {applicants.map(app => (
                  <li key={app.id} className="applicant-card">
                    <div className="applicant-header">
                      <span className="applicant-name">{app.user.username || "Unnamed"}</span>
                      <span className="match-score">Score: {app.match_score || 0}%</span>
                    </div>
                    <div className="applicant-status">
                      <span className={`status-badge ${app.status || "pending"}`}>{app.status}</span>
                    </div>
                    <form
                      className="status-update-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateStatus(app.id, e.target.status.value, e.target.message.value);
                      }}
                    >
                      <select name="status" defaultValue={app.status}>
                        <option value="pending">Pending</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <input name="message" type="text" placeholder="Message" defaultValue={app.recruiter_message || ""} />
                      <button type="submit" className="btn btn-success">Update</button>
                    </form>
                    {app.resume && (
                      <a 
                        href={`http://127.0.0.1:8000${app.resume.url}`} 
                        className="resume-link" 
                        target="_blank" 
                        rel="noreferrer"
                      >
                        <FileText size={16} /> View Resume
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <Users className="empty-state-icon" />
                <p>No applicants found yet.</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="recruiter-dashboard">
      {/* Sidebar */}
      <aside className={`recruiter-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo"><Brain /></div>
          <span className="sidebar-brand">Recruiter</span>
          <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <div
              key={item.id}
              className={`nav-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => setActiveSection(item.id)}
            >
              <item.icon className="nav-icon" />
              <span className="nav-text">{item.label}</span>
              {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
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

      {/* Main */}
      <main className="recruiter-main">
        <header className="recruiter-header">
          <div className="header-left">
            <h2 className="page-title">{activeSection.toUpperCase()}</h2>
          </div>
          <div className="header-right">
            <button className="theme-toggle" onClick={toggleDarkMode}>
              {darkMode ? <Sun /> : <Moon />}
            </button>
            <div className="user-profile">
              <div className="user-avatar">{username ? username[0].toUpperCase() : "U"}</div>
              <div className="user-info">
                <span className="user-name">{username}</span>
                <span className="user-role">Recruiter</span>
              </div>
            </div>
          </div>
        </header>

        <div className="recruiter-content">{renderSection()}</div>
      </main>
    </div>
  );
};

export default RecruiterDashboard;
