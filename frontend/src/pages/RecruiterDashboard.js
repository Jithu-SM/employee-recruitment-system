import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/RecruiterDashboard.css";
import { fetchRecruiterJobs, postJob, fetchApplicants } from "../services/api";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [showApplicants, setShowApplicants] = useState(null);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    skills_required: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecruiterJobs().then(res => setJobs(res.data)).catch(console.error);
  }, []);

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      await postJob(newJob);
      alert("✅ Job posted!");
      setNewJob({ title: "", description: "", company: "", location: "", skills_required: "" });
      fetchRecruiterJobs().then(res => setJobs(res.data));
    } catch {
      alert("❌ Failed to post job.");
    }
  };

  const handleViewApplicants = async (jobId) => {
    try {
      const res = await fetchApplicants(jobId);

      // Ensure applicants is always an array
      if (Array.isArray(res.data)) {
        setApplicants(res.data);
      } else if (res.data && typeof res.data === "object") {
        setApplicants([res.data]);
      } else {
        setApplicants([]);
      }

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
      <form className="job-form" onSubmit={handlePostJob}>
        <input
          type="text"
          placeholder="Job Title"
          value={newJob.title}
          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Company"
          value={newJob.company}
          onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={newJob.location}
          onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
        />
        <textarea
          placeholder="Job Description"
          value={newJob.description}
          onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Required Skills (comma separated)"
          value={newJob.skills_required}
          onChange={(e) => setNewJob({ ...newJob, skills_required: e.target.value })}
        />
        <button type="submit">Post Job</button>
      </form>

      {/* Posted Jobs */}
      <h3>Your Jobs</h3>
      <div className="jobs-list">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <h4>{job.title}</h4>
            <p><b>Company:</b> {job.company || "N/A"}</p>
            <p><b>Location:</b> {job.location || "Remote"}</p>
            <p>{job.description.slice(0, 120)}...</p>
            <p><b>Skills:</b> {job.skills_required}</p>
            <button onClick={() => handleViewApplicants(job.id)}>View Applicants</button>
          </div>
        ))}
      </div>

      {/* Applicants Section */}
      {showApplicants && (
        <div className="applicants-section">
          <h3>Applicants for Job #{showApplicants}</h3>
          {Array.isArray(applicants) && applicants.length > 0 ? (
            <ul>
              {applicants.map((app) => (
                <li key={app.id}>
                  <b>{app.user?.username || "Unknown"}</b> - Match: {app.match_score || "N/A"}%
                  <p>Status: {app.status}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No applicants yet.</p>
          )}
        </div>
      )}

      {/* Logout Button */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default RecruiterDashboard;
