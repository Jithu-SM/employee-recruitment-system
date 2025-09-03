import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // Django backend base URL
});

// Attach JWT token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Use consistent key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

// Auth
export const loginUser = (data) => API.post("token/", data);
export const registerUser = (data) => API.post("register/", data);

// Resumes
export const uploadResume = (formData) =>
  API.post("resumes/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Jobs
export const fetchJobs = () => API.get("jobs/");
export const applyJob = (data) => API.post("applications/", data);

// Fetch parsed resume
export const fetchResume = () => API.get("resumes/");

// Fetch personalized job suggestions
export const fetchJobSuggestions = () => API.get("jobs/suggestions/");
