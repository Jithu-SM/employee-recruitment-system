import { useState } from "react";
import axios from "axios";
import "./styles/Register.css"; // external CSS

function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    user_type: "candidate",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/register/", form);
      alert("✅ Registration successful! Please login.");
    } catch (err) {
      alert("❌ Error registering user");
    }
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleRegister} className="register-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select
          name="user_type"
          value={form.user_type}
          onChange={handleChange}
          required
        >
          <option value="candidate">Candidate</option>
          <option value="recruiter">Recruiter</option>
          {/* 🚫 Removed admin option */}
        </select>
        <button type="submit" className="register-btn">Register</button>
      </form>

      <button
        className="login-btn"
        onClick={() => (window.location.href = "/login")}
      >
        Go to Login
      </button>
    </div>
  );
}

export default Register;
