import React, { useEffect, useState } from "react";
import { fetchResume, fetchJobSuggestions, uploadResume, applyJob } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./styles/CandidateDashboard.css";

const CandidateDashboard = () => {
  const [resume, setResume] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]); // track applied jobs
  const [username, setUsername] = useState("");
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // search bar state
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
                  <b>{job.title}</b> - {job.company}
                  <p>{job.description.slice(0, 100)}...</p>
                </div>

                {appliedJobs.includes(job.id) ? (
                  <button className="applied-btn" disabled>
                    ✅ Applied
                  </button>
                ) : (
                  <button
                    className={`apply-btn ${job.applied ? "applied" : ""}`}
                    onClick={() => handleApply(job.id)}
                    disabled={job.applied}   // disable if already applied
                  >
                    {job.applied ? "Applied" : "Apply"}
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No job suggestions match your search.</p>
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
