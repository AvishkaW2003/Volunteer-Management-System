import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar, Award, Star, CheckCircle, Trophy, Bell,
  Users, HandHelping, ArrowRight, Menu, X,
  Mail, Phone, MapPin, Facebook, Twitter, Linkedin
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./HomePage.css";
/**
 * Home Component
 * 
 * The main landing page for the VolunteerHub application.
 * Contains navigation, hero section, platform features, statistics, action galleries, and footer.
 * Handles role-based routing depending on user authentication status.
 * 
 * @returns {JSX.Element} The rendered Home page layout
 */
const Home = () => {
  // Authentication context for handling user sessions and navigation
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State to manage the mobile responsive hamburger menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="vh-wrapper">
      {/* Layout code will go here */}
    </div>
  );
};

export default Home;
/* -------------------------------------------------------------------------- */
  /*                                MOCK DATA ARRAYS                            */
  /* -------------------------------------------------------------------------- */

  /**
   * Features list configuration (Displayed in a 3x2 Grid)
   * Outlines the core capabilities of the VolunteerHub platform.
   */
  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Event Discovery",
      description: "Browse and apply to hundreds of volunteer opportunities.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Certificate Generation",
      description: "Earn verified certificates for your contributions.",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Reputation Points",
      description: "Build your volunteer reputation and unlock perks.",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Attendance Tracking",
      description: "Automated check-in and participation monitoring.",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Volunteer Leaderboard",
      description: "Compete and get recognized for your impact.",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Smart Notifications",
      description: "Never miss an opportunity with real-time alerts.",
    },
  ];
  /**
   * Volunteers in action gallery (Displayed in a 3-Column Grid)
   * Showcases visual examples of community work.
   */
  const actions = [
    {
      title: "Community Cleanup",
      description: "Making our city cleaner, one event at a time.",
      image: "/images/cleanup_volunteer.png",
    },
    {
      title: "Food Distribution",
      description: "Supporting families in need throughout the community.",
      image: "/images/food_volunteer.png",
    },
    {
      title: "Environmental Care",
      description: "Protecting our planet for future generations.",
      image: "/images/green_volunteer.png",
    },
  ];

  /**
   * Top partner clubs configuration (Displayed in a 4-Column Grid)
   * Highlights associated university or global organizations.
   */
  const clubs = [
    {
      name: "IEEE Student Branch",
      logo: "/images/ieee.png",
      description: "Technology & Innovation",
    },
    {
      name: "Rotaract Club",
      logo: "/images/rotaract.png",
      description: "Community Service",
    },
    {
      name: "Leo Club",
      logo: "/images/leo-club.png",
      description: "Youth Leadership",
    },
    {
      name: "AIESEC",
      logo: "/images/aiesec.png",
      description: "Global Volunteering",
    },
  ];
  /* -------------------------------------------------------------------------- */
  /*                             EVENT HANDLERS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Handles navigation when the user clicks "Explore Events"
   * Redirects based on user role (student, organizer, admin) or to sign-in.
   */
  const handleExplore = () => {
    if (isAuthenticated) {
      if (user?.role === "student") navigate("/student/events");
      else if (user?.role === "organizer") navigate("/organizer/events");
      else navigate("/admin/dashboard");
    } else {
      navigate("/login");
    }
  };

  /**
   * Handles navigation when the user clicks "Join Now" or "Dashboard"
   * Directs authenticated users to their respective dashboards, or unauthenticated users to get-started.
   */
  const handleJoinNow = () => {
    if (isAuthenticated) {
      if (user?.role === "student") navigate("/student/dashboard");
      else if (user?.role === "organizer") navigate("/organizer/dashboard");
      else navigate("/admin/dashboard");
    } else {
      navigate("/get-started");
    }
  };
  {/* ── HEADER & NAVIGATION ─────────────────────────── */}
      <header className="vh-navbar">
        <div className="vh-nav-container">
          
          {/* Main Logo & Branding */}
          <Link to="/" className="vh-logo">
            <div className="vh-logo-icon">
              <HandHelping className="w-5 h-5" />
            </div>
            <span>VolunteerHub</span>
          </Link>
          {/* Center Navigation Links (Visible on Desktop) */}
          <nav className="vh-nav-links">
            <a href="#home" className="vh-nav-link">Home</a>
            <a href="#events" className="vh-nav-link">Events</a>
            <a href="#about" className="vh-nav-link">About</a>
            <a href="#contact" className="vh-nav-link">Contact</a>
          </nav>
          {/* Right Action Buttons (Authentication/Dashboard access for Desktop) */}
          <div className="vh-nav-auth">
            {isAuthenticated ? (
              <div className="vh-nav-user-info">
                <span className="vh-user-greeting">Hello, {user?.name || "Volunteer"}</span>
                <button onClick={logout} className="vh-btn-logout">
                  Logout
                </button>
                <button onClick={handleJoinNow} className="vh-btn-create">
                  Dashboard
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="vh-btn-signin">
                  Sign In
                </Link>
                <Link to="/get-started" className="vh-btn-create">
                  Create Account
                </Link>
              </>
            )}
          </div>
          {/* Hamburger Menu Toggle (Visible only on Mobile) */}
          <button
            className="vh-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {/* Mobile Navigation Drawer (Toggled via mobileMenuOpen state) */}
        <nav className={`vh-mobile-nav ${mobileMenuOpen ? "vh-show" : ""}`}>
          <a href="#home" onClick={() => setMobileMenuOpen(false)} className="vh-nav-link">Home</a>
          <a href="#events" onClick={() => setMobileMenuOpen(false)} className="vh-nav-link">Events</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="vh-nav-link">About</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="vh-nav-link">Contact</a>
          
          <div className="vh-mobile-auth-stack">
            {isAuthenticated ? (
              <>
                <span className="vh-user-greeting" style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                  Hello, {user?.name || "Volunteer"}
                </span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="vh-btn-logout"
                  style={{ width: "100%" }}
                >
                  Logout
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleJoinNow();
                  }}
                  className="vh-btn-create"
                >
                  Dashboard
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="vh-btn-signin">
                  Sign In
                </Link>
                <Link to="/get-started" onClick={() => setMobileMenuOpen(false)} className="vh-btn-create">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main>
        
        {/* ── SECTION 1: HERO ─────────────────────────────────── */}
        {/* The main landing area introducing the platform value proposition */}
        <section id="home" className="vh-hero">
          <div className="vh-hero-container">
            {/* Left Column: Headline and Call-to-Action buttons */}
            <div className="vh-hero-content">
              <h1 className="vh-hero-heading">
                Empowering Students Through <span className="blue-highlight">Volunteer Opportunities</span>
              </h1>
              <p className="vh-hero-subtext">
                Join hundreds of students making a difference. Discover events, earn certificates, and build your reputation.
              </p>
              <div className="vh-hero-buttons">
                <button onClick={handleExplore} className="vh-btn-primary">
                  Explore Events <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={handleJoinNow} className="vh-btn-secondary">
                  Join Now
                </button>
              </div>
            </div>

            {/* Right Column: Hero graphic/image showcase */}
            <div className="vh-hero-media">
              <div className="vh-hero-image-card">
                <div className="vh-hero-image-wrapper">
                  <img
                    src="/images/hero-volunteers.jpg"
                    alt="Students volunteering together at VolunteerHub"
                    className="vh-hero-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ── SECTION 2: PLATFORM FEATURES ─────────────────────── */}
        {/* Dynamically maps through the 'features' array to generate cards */}
        <section id="about" className="vh-features">
          <div className="vh-features-container">
            <div className="vh-section-header">
              <h2 className="vh-section-title">Platform Features</h2>
              <p className="vh-section-subtitle">Everything you need to manage your volunteer journey</p>
            </div>

            <div className="vh-features-grid">
              {features.map((feature, idx) => (
                <div key={idx} className="vh-feature-card">
                  <div className="vh-feature-icon-wrapper">
                    {feature.icon}
                  </div>
                  <h3 className="vh-feature-title">{feature.title}</h3>
                  <p className="vh-feature-desc">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* ── SECTION 3: PLATFORM HIGHLIGHTS ──────────────────── */}
        <section className="vh-stats">
          <div className="vh-stats-container">
            <div className="vh-stat-item">
              <span className="vh-stat-number">3</span>
              <p className="vh-stat-label">User Roles — Student, Organizer & Admin</p>
            </div>
            <div className="vh-stat-item">
              <span className="vh-stat-number">100%</span>
              <p className="vh-stat-label">Digital Certificates for Every Event</p>
            </div>
            <div className="vh-stat-item">
              <span className="vh-stat-number">Real‑time</span>
              <p className="vh-stat-label">Notifications & Application Updates</p>
            </div>
            <div className="vh-stat-item">
              <span className="vh-stat-number">Live</span>
              <p className="vh-stat-label">Leaderboard & Reputation Points</p>
            </div>
          </div>
        </section>