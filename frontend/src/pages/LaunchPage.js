import React from 'react';
import { Users, Brain, Target, Shield, Zap, CheckCircle } from 'lucide-react';
import './styles/LaunchPage.css';
import { useNavigate, Link } from 'react-router-dom';

const LaunchPage = () => {
  const navigate = useNavigate();

  return (
    <div className="launch-page">
      {/* Header */}
      <header className="header">
        <nav className="navbar">
          <div className="nav-brand">
            <Brain className="logo-icon" />
            <span className="brand-name">RecruitAI</span>
          </div>
          <div className="nav-actions">
            <button className="btn btn-outline" onClick={() => navigate('/login')}>Login</button>
            <button className="btn btn-primary" onClick={() => navigate('/register')}>Register</button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Transform Your Hiring with 
              <span className="gradient-text"> AI-Powered Recruitment</span>
            </h1>
            <p className="hero-description">
              Streamline your recruitment process with intelligent resume parsing, 
              smart candidate matching, and automated application management. 
              Find the perfect talent faster than ever before.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-large" onClick={() => navigate('/register')}>Get Started</button>
              <button className="btn btn-outline btn-large" onClick={() => navigate('/demo')}>Watch Demo</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <Target className="card-icon" />
              <span>Smart Matching</span>
            </div>
            <div className="floating-card card-2">
              <Brain className="card-icon" />
              <span>AI-Powered</span>
            </div>
            <div className="floating-card card-3">
              <Users className="card-icon" />
              <span>Team Management</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Powerful Features for Modern Recruitment</h2>
            <p>Everything you need to streamline your hiring process and find the best candidates</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Brain />
              </div>
              <h3>AI Resume Parsing</h3>
              <p>Automatically extract and analyze candidate information from resumes using advanced NLP technology</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Target />
              </div>
              <h3>Smart Job Matching</h3>
              <p>TF-IDF and cosine similarity algorithms match candidates to jobs with precision scoring</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Users />
              </div>
              <h3>Application Tracking</h3>
              <p>Complete application lifecycle management with real-time status updates and notifications</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Shield />
              </div>
              <h3>Secure Authentication</h3>
              <p>JWT-based authentication ensures secure access for candidates, recruiters, and administrators</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Zap />
              </div>
              <h3>Real-time Dashboard</h3>
              <p>Interactive dashboards provide insights and analytics for better recruitment decisions</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <CheckCircle />
              </div>
              <h3>Status Management</h3>
              <p>Streamlined application status updates with automated candidate notifications</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Simple steps to revolutionize your recruitment process</p>
          </div>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Candidates Upload Resumes</h3>
                <p>Job seekers register and upload their resumes in PDF format for automatic parsing</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>AI Processes & Matches</h3>
                <p>Our AI extracts key information and matches candidates to relevant job postings</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Recruiters Review & Decide</h3>
                <p>Recruiters view ranked candidates and manage applications with one-click actions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats" id="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Matching Accuracy</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">60%</div>
              <div className="stat-label">Faster Hiring</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10k+</div>
              <div className="stat-label">Resumes Processed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Companies Trust Us</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Recruitment?</h2>
            <p>Join hundreds of companies already using RecruitAI to find their perfect candidates</p>
            <div className="cta-actions">
              <button className="btn btn-primary btn-large" onClick={() => navigate('/register')}>Start Free Trial</button>
              <button className="btn btn-outline btn-large" onClick={() => navigate('/contact')}>Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <Brain className="logo-icon" />
              <span className="brand-name">RecruitAI</span>
              <p>AI-powered recruitment platform for the modern workplace</p>
            </div>
            
            <div className="footer-links">
              <div className="link-group">
                <h4>Product</h4>
                <Link to="/features">Features</Link>
                <Link to="/pricing">Pricing</Link>
                <Link to="/demo">Demo</Link>
              </div>
              
              <div className="link-group">
                <h4>Company</h4>
                <Link to="/about">About Us</Link>
                <Link to="/careers">Careers</Link>
                <Link to="/contact">Contact</Link>
              </div>
              
              <div className="link-group">
                <h4>Support</h4>
                <Link to="/help">Help Center</Link>
                <Link to="/docs">Documentation</Link>
                <Link to="/api">API</Link>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 RecruitAI. All rights reserved.</p>
            <div className="footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LaunchPage;