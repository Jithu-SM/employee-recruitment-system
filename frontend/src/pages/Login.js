import { useState } from "react";
import axios from "axios";
import "./styles/Login.css";
import { useNavigate } from "react-router-dom"; // Add this import

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.access);
      alert("Login successful!");
      navigate("/dashboard"); // Redirect to candidate dashboard
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
export default Login;
