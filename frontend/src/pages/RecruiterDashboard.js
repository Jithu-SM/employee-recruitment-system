import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/RecruiterDashboard.css";
import { fetchRecruiterJobs, postJob, fetchApplicants } from "../services/api";
import axios from "axios";

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
  const [messages, setMessages] = useState({});


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

      let apps = [];
      if (Array.isArray(res.data)) {
        apps = res.data;
      } else if (res.data && typeof res.data === "object") {
        apps = [res.data];
      }

      // sort by match_score (descending)
      apps.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
      setApplicants(apps);
      setShowApplicants(jobId);
    } catch {
      alert("Could not fetch applicants.");
    }
  };

    // Update applicant status
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
      alert("✅ Status updated!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update status.");
    }
  };

  // Logout
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
            <p><b>Location:</b> {job.location || "N/A"}</p>
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
                <li key={app.id} className="applicant-card">
                  <b>{app.user?.username || "Unknown"}</b>  
                  - Match: {app.match_score || "N/A"}%  
                  <p>Status: {app.status}</p>

                  {/* Status + Message Form */}
                  <div className="status-message-form">
                    <select
                      value={messages[app.id]?.status || app.status || "Pending"}
                      onChange={(e) =>
                        setMessages({
                          ...messages,
                          [app.id]: {
                            ...messages[app.id],
                            status: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Add a message (optional)"
                      value={messages[app.id]?.message || ""}
                      onChange={(e) =>
                        setMessages({
                          ...messages,
                          [app.id]: {
                            ...messages[app.id],
                            message: e.target.value,
                          },
                        })
                      }
                    />

                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          app.id,
                          messages[app.id]?.status || app.status,
                          messages[app.id]?.message || ""
                        )
                      }
                    >
                      ✅ Update
                    </button>
                  </div>

                  {/* View Resume button */}
                  {app.resume?.url ? (
                    <a
                      href={`http://127.0.0.1:8000${app.resume.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resume-btn"
                    >
                      📄 View Resume
                    </a>
                  ) : (
                    <p>No resume uploaded</p>
                  )}
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
