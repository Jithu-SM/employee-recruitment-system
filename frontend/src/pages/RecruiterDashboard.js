import React, { useEffect, useState } from "react";
import { fetchRecruiterJobs, postJob, fetchApplicants } from "../services/api";
import { useNavigate } from "react-router-dom";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [showApplicants, setShowApplicants] = useState(null);
  const [newJob, setNewJob] = useState({ title: "", description: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecruiterJobs().then(res => setJobs(res.data)).catch(console.error);
  }, []);

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      await postJob(newJob);
      alert("Job posted!");
      setNewJob({ title: "", description: "" });
      fetchRecruiterJobs().then(res => setJobs(res.data));
    } catch {
      alert("Failed to post job.");
    }
  };

  const handleViewApplicants = async (jobId) => {
    try {
      const res = await fetchApplicants(jobId);
      setApplicants(res.data);
      setShowApplicants(jobId);
    } catch {
      alert("Could not fetch applicants.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="recruiter-dashboard">
      <h2>Recruiter Dashboard</h2>

      {/* Job Posting Form */}
      <form onSubmit={handlePostJob}>
        <input
          type="text"
          placeholder="Job Title"
          value={newJob.title}
          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Job Description"
          value={newJob.description}
          onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
          required
        />
        <button type="submit">Post Job</button>
      </form>

      {/* Posted Jobs */}
      <h3>Your Jobs</h3>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <b>{job.title}</b>
            <button onClick={() => handleViewApplicants(job.id)}>View Applicants</button>
          </li>
        ))}
      </ul>

      {/* Applicants Section */}
      {showApplicants && (
        <div className="applicants-section">
          <h3>Applicants for Job #{showApplicants}</h3>
          <ul>
            {applicants.map((app) => (
              <li key={app.id}>
                <b>{app.user.username}</b> - Match: {app.match_score}%
                <p>Status: {app.status}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Logout Button */}
      <button
        style={{
          marginTop: "2rem",
          padding: "0.5rem 1.5rem",
          background: "#dc3545",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          position: "fixed",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)"
        }}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default RecruiterDashboard;
