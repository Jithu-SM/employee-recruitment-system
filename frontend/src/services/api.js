import axios from "axios";

// Base API instance with JWT support
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =========================
// Auth
// =========================
export const loginUser = (data) => API.post("token/", data);
export const registerUser = (data) => API.post("register/", data);

// =========================
// Resumes
// =========================
export const uploadResume = (formData) =>
  API.post("resumes/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const fetchResume = () => API.get("resumes/");

// =========================
// Jobs
// =========================
export const fetchJobs = () => API.get("jobs/");
export const fetchJobSuggestions = () => API.get("jobs/suggestions/");
export const fetchRecruiterJobs = () => API.get("jobs/recruiter/");
export const postJob = (jobData) => API.post("jobs/recruiter/", jobData);

// =========================
// Applications
// =========================
export const applyJob = (jobId) => API.post(`applications/${jobId}/apply/`);

// 🔹 FIX: applicants by job route
export const fetchApplicants = (jobId) =>
  API.get(`applications/job/${jobId}/`);
