import React, { useEffect, useState } from "react";
import { fetchResume, fetchJobSuggestions, uploadResume, applyJob, fetchApplicationStatus } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Home,
  FileText,
  Briefcase,
  Bell,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Upload,
  Search,
  MapPin,
  Building,
  CheckCircle,
} from "lucide-react";
import "./styles/CandidateDashboard.css";

const CandidateDashboard = () => {
  const [resume, setResume] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [username, setUsername] = useState("");
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusJobId, setStatusJobId] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [applications, setApplications] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const navigate = useNavigate();

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

  // Decode JWT to get username
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUsername(payload.username || payload.user_name || "");
    }
  }, []);

  useEffect(() => {
    fetchResume()
      .then((res) => setResume(res.data))
      .catch((err) => console.error(err));

    fetchJobSuggestions()
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));

    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://127.0.0.1:8000/api/applications/my-applications/", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setApplications(data))
        .catch((err) => console.error("Error fetching applications", err));
    }
  }, []);

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    const file = e.target.resume.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      await uploadResume(formData);
      alert("Resume uploaded successfully!");
      fetchResume()
        .then((res) => setResume(res.data))
        .catch((err) => console.error(err));
    } catch {
      alert("Resume upload failed.");
    }
    setUploading(false);
  };

  const handleApply = async (jobId) => {
    try {
      const res = await applyJob(jobId);
      alert(res.data.message);
      setJobs(jobs.map(job =>
        job.id === jobId ? { ...job, applied: true } : job
      ));
    } catch (err) {
      if (err.response?.data?.message === "Already applied") {
        setJobs(jobs.map(job =>
          job.id === jobId ? { ...job, applied: true } : job
        ));
      }
      alert(err.response?.data?.message || "Application failed.");
    }
  };

  const handleShowStatus = async (jobId) => {
    if (statusJobId === jobId) {
      setStatusJobId(null);
      setCurrentStatus(null);
      return;
    }
    setStatusJobId(jobId);
    try {
      const data = await fetchApplicationStatus(jobId);
      setCurrentStatus(data.status || data.detail || "Unknown");
    } catch (err) {
      setCurrentStatus("Unable to fetch status.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills_required?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const notificationCount = applications.filter(a => a.recruiter_message).length;

  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "resume", label: "My Resume", icon: FileText },
    { id: "jobs", label: "Job Suggestions", icon: Briefcase },
    { id: "notifications", label: "Notifications", icon: Bell, badge: notificationCount },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <>
            {/* Resume Section */}
            <div className="dashboard-section">
              <div className="section-header">
                <h3 className="section-title">
                  <FileText size={28} />
                  Resume Information
                </h3>
              </div>
              {resume && resume.parsed_data ? (
                <div className="resume-data-card">
                  <div className="resume-data-item">
                    <div className="resume-data-label">Name</div>
                    <div className="resume-data-value">{resume.parsed_data.name || "N/A"}</div>
                  </div>
                  <div className="resume-data-item">
                    <div className="resume-data-label">Skills</div>
                    <div className="resume-data-value">{resume.parsed_data.skills?.join(", ") || "N/A"}</div>
                  </div>
                  <div className="resume-data-item">
                    <div className="resume-data-label">Education</div>
                    <div className="resume-data-value">{resume.parsed_data.education || "N/A"}</div>
                  </div>
                  <div className="resume-data-item">
                    <div className="resume-data-label">Experience</div>
                    <div className="resume-data-value">{resume.parsed_data.experience || "N/A"}</div>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <FileText className="empty-state-icon" size={80} />
                  <p>Upload your resume to see parsed details.</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="dashboard-section">
              <div className="section-header">
                <h3 className="section-title">
                  <Briefcase size={28} />
                  Application Status Overview
                </h3>
              </div>
              {jobs.filter(job => job.applied).length > 0 ? (
                <div className="job-grid">
                  {jobs.filter(job => job.applied).slice(0, 3).map((job) => (
                    <div key={job.id} className="notification-card">
                      <div className="job-header">
                        <h4 className="job-title">{job.title}</h4>
                        <p className="job-company">
                          <Building size={16} />
                          {job.company || "N/A"}
                        </p>
                      </div>
                      <div className="job-meta">
                        <span className="job-meta-item">
                          <MapPin size={14} />
                          {job.location || "Remote"}
                        </span>
                      </div>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleShowStatus(job.id)}
                      >
                        {statusJobId === job.id ? "Hide Status" : "Check Status"}
                      </button>
                      {statusJobId === job.id && currentStatus && (
                        <div style={{ marginTop: '12px' }}>
                          <span className={`status-badge ${currentStatus.toLowerCase()}`}>
                            {currentStatus}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Briefcase className="empty-state-icon" size={80} />
                  <p>No applications yet. Start applying to jobs!</p>
                </div>
              )}
            </div>
          </>
        );

      case "resume":
        return (
          <div className="dashboard-section">
            <div className="section-header">
              <h3 className="section-title">
                <FileText size={28} />
                Upload Resume
              </h3>
            </div>
            <form onSubmit={handleResumeUpload} className="resume-upload-form">
              <div className="file-input-wrapper">
                <input type="file" name="resume" accept=".pdf,.doc,.docx" required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={uploading}>
                <Upload size={18} />
                {uploading ? "Uploading..." : "Upload Resume"}
              </button>
            </form>

            {resume && resume.parsed_data && (
              <div style={{ marginTop: '30px' }}>
                <h4 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Your Resume Data</h4>
                <div className="resume-data-card">
                  <div className="resume-data-item">
                    <div className="resume-data-label">Name</div>
                    <div className="resume-data-value">{resume.parsed_data.name || "N/A"}</div>
                  </div>
                  <div className="resume-data-item">
                    <div className="resume-data-label">Skills</div>
                    <div className="resume-data-value">{resume.parsed_data.skills?.join(", ") || "N/A"}</div>
                  </div>
                  <div className="resume-data-item">
                    <div className="resume-data-label">Education</div>
                    <div className="resume-data-value">{resume.parsed_data.education || "N/A"}</div>
                  </div>
                  <div className="resume-data-item">
                    <div className="resume-data-label">Experience</div>
                    <div className="resume-data-value">{resume.parsed_data.experience || "N/A"}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "jobs":
        return (
          <div className="dashboard-section">
            <div className="section-header">
              <h3 className="section-title">
                <Briefcase size={28} />
                Recommended Jobs
              </h3>
            </div>
            
            <div className="search-icon-wrapper" style={{ position: 'relative', marginBottom: '24px' }}>
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search jobs by title, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            {filteredJobs.length > 0 ? (
              <div className="job-grid">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="notification-card">
                    <div className="job-header">
                      <h4 className="job-title">{job.title}</h4>
                      <p className="job-company">
                        <Building size={16} />
                        {job.company || "N/A"}
                      </p>
                    </div>
                    <div className="job-meta">
                      <span className="job-meta-item">
                        <MapPin size={14} />
                        {job.location || "Remote"}
                      </span>
                    </div>
                    <p className="job-description">
                      {job.description ? job.description.slice(0, 150) + "..." : "No description available"}
                    </p>
                    <div className="job-actions">
                      {job.applied ? (
                        <button className="btn btn-applied" disabled>
                          <CheckCircle size={18} />
                          Applied
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleApply(job.id)}
                        >
                          Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Briefcase className="empty-state-icon" size={80} />
                <p>No job suggestions match your search.</p>
              </div>
            )}
          </div>
        );

      case "notifications":
        return (
          <div className="dashboard-section">
            <div className="section-header">
              <h3 className="section-title">
                <Bell size={28} />
                Notifications
              </h3>
            </div>
            {applications.filter(a => a.recruiter_message).length > 0 ? (
              <ul className="notification-list">
                {applications
                  .filter(a => a.recruiter_message)
                  .map((app) => (
                    <li key={app.id} className="notification-card">
                      <div className="notification-header">
                        {app.job.title} @ {app.job.company}
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <span className={`status-badge ${app.status.toLowerCase()}`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="notification-message">
                        {app.recruiter_message}
                      </p>
                      <small className="notification-date">
                        Updated on {new Date(app.created_at).toLocaleDateString()}
                      </small>
                    </li>
                  ))}
              </ul>
            ) : (
              <div className="empty-state">
                <Bell className="empty-state-icon" size={80} />
                <p>No notifications yet.</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="candidate-dashboard">
      {/* Sidebar */}
      <aside className={`candidate-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
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
              {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
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
      <main className="candidate-main">
        {/* Top Header */}
        <header className="candidate-header">
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
              <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
              <div className="user-info">
                <div className="user-name">{username}</div>
                <div className="user-role">Candidate</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="candidate-content">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default CandidateDashboard;