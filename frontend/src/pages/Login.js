import "./styles/Login.css";
import { useNavigate } from "react-router-dom";
import { Brain, LogIn, UserPlus, ArrowLeft, Lock, User } from "lucide-react";

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
          console.log(payload);
          if (payload.is_approved) {
            navigate("/recruiter-dashboard");
          } else {
            alert("Your recruiter account is awaiting admin approval.");
            navigate("/login");
          }
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
    <div className="login-page">
      {/* Background decoration */}
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Header */}
      <div className="login-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>
        <div className="login-brand">
          <Brain className="brand-icon" />
          <span className="brand-text">RecruitAI</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="login-content">
        {/* Left Side - Info Panel */}
        <div className="login-info">
          <div className="info-content">
            <h1 className="info-title">
              Welcome Back to <span className="gradient-text">RecruitAI</span>
            </h1>
            <p className="info-description">
              Access your personalized dashboard and continue your journey towards finding the perfect career match or the ideal candidate.
            </p>
            
            <div className="info-features">
              <div className="info-feature">
                <div className="feature-icon-small">
                  <Brain size={20} />
                </div>
                <div>
                  <h3>AI-Powered Matching</h3>
                  <p>Intelligent algorithms connect you with the right opportunities</p>
                </div>
              </div>
              <div className="info-feature">
                <div className="feature-icon-small">
                  <Lock size={20} />
                </div>
                <div>
                  <h3>Secure & Private</h3>
                  <p>Your data is protected with enterprise-grade security</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-container">
          <div className="login-card">
            <div className="login-card-header">
              <div className="login-icon">
                <LogIn size={28} />
              </div>
              <h2 className="login-title">Sign In</h2>
              <p className="login-subtitle">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  <User size={18} />
                  <span>Username</span>
                </label>
                <input 
                  type="text" 
                  id="username"
                  name="username" 
                  placeholder="Enter your username" 
                  className="form-input"
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <Lock size={18} />
                  <span>Password</span>
                </label>
                <input 
                  type="password" 
                  id="password"
                  name="password" 
                  placeholder="Enter your password" 
                  className="form-input"
                  required 
                />
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" className="forgot-link">Forgot password?</a>
              </div>

              <button type="submit" className="login-btn">
                <LogIn size={20} />
                <span>Sign In</span>
              </button>
            </form>

            <div className="divider">
              <span>or</span>
            </div>

            <button
              className="register-btn"
              onClick={() => navigate("/register")}
            >
              <UserPlus size={20} />
              <span>Create New Account</span>
            </button>

            <p className="login-footer-text">
              Don't have an account? <a href="#register" onClick={(e) => { e.preventDefault(); navigate("/register"); }}>Sign up now</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;