import "./styles/Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.access) {
        localStorage.setItem("token", data.access);

        // Decode JWT to check role
        const payload = JSON.parse(atob(data.access.split(".")[1]));
        if (payload.user_type === "recruiter") {
          navigate("/recruiter-dashboard");
        } else if (payload.user_type === "candidate") {
          navigate("/candidate-dashboard");
        } else if (payload.user_type === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/login");
        }
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit" className="login-btn">Login</button>
      </form>

      <button
        className="register-btn"
        onClick={() => navigate("/register")}
      >
        Go to Register
      </button>
    </div>
  );
};

export default Login;
