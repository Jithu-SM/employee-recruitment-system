import React, { useEffect, useState } from "react";
import { fetchResume, fetchJobSuggestions, uploadResume, applyJob, fetchApplicationStatus } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./styles/CandidateDashboard.css";

const CandidateDashboard = () => {
  const [resume, setResume] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]); // track applied jobs
  const [username, setUsername] = useState("");
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // search bar state
  const [statusJobId, setStatusJobId] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  const navigate = useNavigate();

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
  }, []);

  // Resume upload handler
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

  // Apply button handler
  const handleApply = async (jobId) => {
  try {
    const res = await applyJob(jobId);
    alert(res.data.message);

    // Update job list marking job as applied
    setJobs(jobs.map(job =>
      job.id === jobId ? { ...job, applied: true } : job
    ));
  } catch (err) {
    if (err.response?.data?.message === "Already applied") {
      // Mark it applied if backend says so
      setJobs(jobs.map(job =>
        job.id === jobId ? { ...job, applied: true } : job
      ));
    }
    alert(err.response?.data?.message || "Application failed.");
  }
};

  // Show application status
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

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Filter jobs based on search
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills_required?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard">
      <h2>Candidate Dashboard</h2>
      <p>Welcome, <b>{username}</b>!</p>

      {/* Resume Upload */}
      <form onSubmit={handleResumeUpload} className="resume-upload">
        <input type="file" name="resume" accept=".pdf,.doc,.docx" required />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Resume"}
        </button>
      </form>

      {/* Resume Section */}
      {resume && resume.parsed_data ? (
        <div className="resume-section card">
          <h3>Your Resume Data</h3>
          <p><b>Name:</b> {resume.parsed_data.name || "N/A"}</p>
          <p><b>Skills:</b> {resume.parsed_data.skills?.join(", ") || "N/A"}</p>
          <p><b>Education:</b> {resume.parsed_data.education || "N/A"}</p>
          <p><b>Experience:</b> {resume.parsed_data.experience || "N/A"}</p>
        </div>
      ) : (
        <p>Upload your resume to see parsed details.</p>
      )}

      {/* Job Suggestions Section */}
      <div className="jobs-section">
        <h3>Recommended Jobs</h3>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search jobs by title, company, or skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="job-search"
        />

        {filteredJobs.length > 0 ? (
          <ul className="job-list">
            {filteredJobs.map((job) => (
              <li key={job.id} className="job-card">
                <div className="job-info">
                  <h4>{job.title}</h4>
                  <p><b>Company:</b> {job.company || "N/A"}</p>
                  <p><b>Location:</b> {job.location || "Remote"}</p>
                  <p>{job.description.slice(0, 150)}...</p>
                </div>
                {job.applied ? (
                  <>
                    <button className="apply-btn applied" disabled>
                      Applied
                    </button>
                  </>
                ) : (
                  <button
                    className={`apply-btn`}
                    onClick={() => handleApply(job.id)}
                  >
                    Apply
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No job suggestions match your search.</p>
        )}
      </div>

      {/* Application Status Section */}
      <div className="status-section">
        <h3>Application Status</h3>
        {jobs.length === 0 ? (
          <p>No applications found. Apply to jobs to see status here.</p>
        ) : (
          <ul className="status-list">
            {jobs.map((job) => (
              <li key={job.id} className="status-item">
                <div className="status-info">
                  <p><b>Job Title:</b> {job.title}</p>
                  <p><b>Company:</b> {job.company}</p>
                </div>

                {/* Show status button */}
                {job.applied && (
                  <button
                    className="show-status-btn"
                    onClick={() => handleShowStatus(job.id)}
                  >
                    {statusJobId === job.id ? "Hide Status" : "Show Status"}
                  </button>
                )}

                {/* Current status badge */}
                {statusJobId === job.id && (
                  <div className="current-status">
                    <p>{currentStatus}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Logout Button */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default CandidateDashboard;
