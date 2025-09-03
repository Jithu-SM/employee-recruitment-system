import React, { useEffect, useState } from "react";
import { fetchResume, fetchJobSuggestions } from "../services/api";

const Dashboard = () => {
  const [resume, setResume] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Load parsed resume
    fetchResume()
      .then((res) => setResume(res.data))
      .catch((err) => console.error(err));

    // Load job suggestions
    fetchJobSuggestions()
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="dashboard">
      <h2>Candidate Dashboard</h2>

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
