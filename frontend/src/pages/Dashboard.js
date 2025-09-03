import React, { useEffect, useState } from "react";
import { fetchResume, fetchJobSuggestions, uploadResume } from "../services/api";

const Dashboard = () => {
  const [resume, setResume] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [username, setUsername] = useState("");
  const [uploading, setUploading] = useState(false);

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
    formData.append("resume", file);
    setUploading(true);
    try {
      await uploadResume(formData);
      alert("Resume uploaded successfully!");
      // Refresh resume data
      fetchResume()
        .then((res) => setResume(res.data))
        .catch((err) => console.error(err));
    } catch {
      alert("Resume upload failed.");
    }
    setUploading(false);
  };

  return (
    <div className="dashboard">
      <h2>Candidate Dashboard</h2>
      <p>Welcome, <b>{username}</b>!</p>

      {/* Resume Upload */}
      <form onSubmit={handleResumeUpload}>
        <input type="file" name="resume" accept=".pdf,.doc,.docx" required />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Resume"}
        </button>
      </form>

      {/* Resume Section */}
      {resume ? (
        <div className="resume-section">
          <h3>Your Resume Data</h3>
          <p><b>Name:</b> {resume.parsed_data.name}</p>
          <p><b>Skills:</b> {resume.parsed_data.skills.join(", ")}</p>
          <p><b>Education:</b> {resume.parsed_data.education}</p>
          <p><b>Experience:</b> {resume.parsed_data.experience}</p>
        </div>
      ) : (
        <p>Upload your resume to see parsed details.</p>
      )}

      {/* Job Suggestions Section */}
      <div className="jobs-section">
        <h3>Recommended Jobs</h3>
        {jobs.length > 0 ? (
          <ul>
            {jobs.map((job) => (
              <li key={job.id}>
                <b>{job.title}</b> - {job.company}
                <p>{job.description.slice(0, 100)}...</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No job suggestions yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
