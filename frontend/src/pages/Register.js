import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Brain, 
  UserPlus, 
  LogIn, 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Briefcase, 
  Target,
  Zap,
  Shield
} from "lucide-react";
import "./styles/Register.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    user_type: "candidate",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (type) => {
    setForm({ ...form, user_type: type });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/register/", form);
      alert("✅ Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert("❌ Error registering user");
    }
  };

  return (
    <div className="register-page">
      {/* Background decoration */}
      <div className="register-bg-shapes">
        <div className="register-shape register-shape-1"></div>
        <div className="register-shape register-shape-2"></div>
        <div className="register-shape register-shape-3"></div>
      </div>

      {/* Header */}
      <div className="register-header">
        <button className="register-back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>
        <div className="register-brand">
          <Brain className="register-brand-icon" />
          <span className="register-brand-text">RecruitAI</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="register-content">
        {/* Left Side - Info Panel */}
        <div className="register-info">
          <div className="register-info-content">
            <h1 className="register-info-title">
              Start Your Journey with <span className="register-gradient-text">RecruitAI</span>
            </h1>
            <p className="register-info-description">
              Join thousands of professionals who have found their perfect match. 
              Whether you're seeking talent or looking for your next opportunity, 
              we've got you covered.
            </p>
            
            <div className="register-info-benefits">
              <div className="register-benefit">
                <div className="register-benefit-icon">
                  <Zap size={20} />
                </div>
                <div>
                  <h3>Quick Setup</h3>
                  <p>Get started in minutes with our streamlined registration process</p>
                </div>
              </div>
              
              <div className="register-benefit">
                <div className="register-benefit-icon">
                  <Target size={20} />
                </div>
                <div>
                  <h3>Smart Matching</h3>
                  <p>Our AI connects you with the most relevant opportunities</p>
                </div>
              </div>
              
              <div className="register-benefit">
                <div className="register-benefit-icon">
                  <Shield size={20} />
                </div>
                <div>
                  <h3>Secure Platform</h3>
                  <p>Your data is protected with industry-leading security</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="register-form-wrapper">
          <div className="register-card">
            <div className="register-card-header">
              <div className="register-icon">
                <UserPlus size={28} />
              </div>
              <h2 className="register-title">Create Account</h2>
              <p className="register-subtitle">Fill in your details to get started</p>
            </div>

            <form onSubmit={handleRegister} className="register-form">
              <div className="register-form-group">
                <label htmlFor="username" className="register-form-label">
                  <User size={18} />
                  <span>Username</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Choose a username"
                  className="register-form-input"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="register-form-group">
                <label htmlFor="email" className="register-form-label">
                  <Mail size={18} />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your.email@example.com"
                  className="register-form-input"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="register-form-group">
                <label htmlFor="password" className="register-form-label">
                  <Lock size={18} />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a strong password"
                  className="register-form-input"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="register-form-group">
                <label className="register-form-label">
                  <Briefcase size={18} />
                  <span>I am a</span>
                </label>
                <div className="register-user-type-cards">
                  <div 
                    className={`register-user-type-card ${form.user_type === 'candidate' ? 'active' : ''}`}
                    onClick={() => handleUserTypeChange('candidate')}
                  >
                    <User size={32} />
                    <h4>Candidate</h4>
                    <p>Looking for jobs</p>
                  </div>
                  <div 
                    className={`register-user-type-card ${form.user_type === 'recruiter' ? 'active' : ''}`}
                    onClick={() => handleUserTypeChange('recruiter')}
                  >
                    <Briefcase size={32} />
                    <h4>Recruiter</h4>
                    <p>Hiring talent</p>
                  </div>
                </div>
                {/* Hidden select for form submission */}
                <select
                  name="user_type"
                  value={form.user_type}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                  required
                >
                  <option value="candidate">Candidate</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </div>

              <button type="submit" className="register-submit-btn">
                <UserPlus size={20} />
                <span>Create Account</span>
              </button>
            </form>

            <div className="register-divider">
              <span>or</span>
            </div>

            <button
              className="register-login-btn"
              onClick={() => navigate("/login")}
            >
              <LogIn size={20} />
              <span>Sign In to Existing Account</span>
            </button>

            <p className="register-footer-text">
              Already have an account? <a href="#login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>Sign in here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;