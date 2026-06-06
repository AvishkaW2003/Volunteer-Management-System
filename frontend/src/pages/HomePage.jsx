import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar, Award, Star, CheckCircle, Trophy, Bell,
  Users, HandHelping, ArrowRight, Menu, X,
  Mail, Phone, MapPin, Facebook, Twitter, Linkedin
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./HomePage.css";

/**
 * AnimatedCounter Component
 * 
 * A utility component that creates a smooth count-up animation from 0 to a specified target number.
 * Useful for statistics banners and data visualization.
 * 
 * @param {Object} props - Component props
 * @param {number} props.end - The final number the counter should reach
 * @param {string} [props.suffix=""] - Optional string to append to the end of the number (e.g., "+", "%")
 * @returns {JSX.Element} The animated number display
 */
const AnimatedCounter = ({ end, suffix = "" }) => {
  // State to track the current animated value
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // Total animation duration in milliseconds
    
    // Calculate how much to increment per frame (assuming ~60fps / 16ms per frame)
    const increment = end / (duration / 16); 
    
    // Set up the animation interval
    const timer = setInterval(() => {
      start += increment;
      
      // Stop the animation once we reach or exceed the target number
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        // Round down to ensure clean whole numbers during the animation
        setCount(Math.floor(start));
      }
    }, 16);

    // Cleanup function to clear the interval if the component unmounts
    return () => clearInterval(timer);
  }, [end]);

  return (
    <span className="vh-stat-number">
      {count}{suffix}
    </span>
  );
};

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
      image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&q=80",
    },
    {
      title: "Food Distribution",
      description: "Supporting families in need throughout the community.",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80",
    },
    {
      title: "Environmental Care",
      description: "Protecting our planet for future generations.",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80",
    },
  ];

  /**
   * Top partner clubs configuration (Displayed in a 4-Column Grid)
   * Highlights associated university or global organizations.
   */
  const clubs = [
    {
      name: "IEEE",
      initials: "IEEE",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600",
      events: "45 Events",
    },
    {
      name: "Rotaract",
      initials: "ROT",
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600",
      events: "38 Events",
    },
    {
      name: "Leo Club",
      initials: "LEO",
      image: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=600",
      events: "32 Events",
    },
    {
      name: "AIESEC",
      initials: "AIE",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600",
      events: "28 Events",
    },
  ];

  /**
   * User testimonials (Displayed in a 3-Column Grid)
   * Provides social proof from active volunteers and organizers.
   */
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Gold Volunteer",
      feedback: "This platform transformed my university experience. I've met amazing people and gained skills I couldn't get in a classroom.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120",
    },
    {
      name: "Ahmed Hassan",
      role: "Event Organizer",
      feedback: "Managing events has never been easier. From tracking attendance to issuing certificates, everything is streamlined.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120",
    },
    {
      name: "Maria Rodriguez",
      role: "Student Leader",
      feedback: "The leaderboard motivated me to participate more. Earning points and certificates really built my campus reputation.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
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
      navigate("/signin");
    }
  };

  /**
   * Handles navigation when the user clicks "Join Now" or "Dashboard"
   * Directs authenticated users to their respective dashboards, or unauthenticated users to register.
   */
  const handleJoinNow = () => {
    if (isAuthenticated) {
      if (user?.role === "student") navigate("/student/dashboard");
      else if (user?.role === "organizer") navigate("/organizer/dashboard");
      else navigate("/admin/dashboard");
    } else {
      navigate("/register");
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                RENDER METHOD                               */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="vh-wrapper">
      
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
                <Link to="/signin" className="vh-btn-signin">
                  Sign In
                </Link>
                <Link to="/register" className="vh-btn-create">
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
                <Link to="/signin" onClick={() => setMobileMenuOpen(false)} className="vh-btn-signin">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="vh-btn-create">
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

        {/* ── SECTION 3: STATS BANNER ─────────────────────────── */}
        {/* Utilizes the custom AnimatedCounter component for dynamic number displays */}
        <section className="vh-stats">
          <div className="vh-stats-container">
            <div className="vh-stat-item">
              <AnimatedCounter end={500} suffix="+" />
              <p className="vh-stat-label">Active Volunteers</p>
            </div>
            <div className="vh-stat-item">
              <AnimatedCounter end={120} suffix="+" />
              <p className="vh-stat-label">Events Hosted</p>
            </div>
            <div className="vh-stat-item">
              <AnimatedCounter end={20} suffix="+" />
              <p className="vh-stat-label">Partner Clubs</p>
            </div>
            <div className="vh-stat-item">
              <AnimatedCounter end={1500} suffix="+" />
              <p className="vh-stat-label">Volunteer Hours</p>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: VOLUNTEERS IN ACTION ──────────────────── */}
        {/* Visual gallery mapping through the 'actions' mock data array */}
        <section id="events" className="vh-action">
          <div className="vh-action-container">
            <div className="vh-section-header">
              <h2 className="vh-section-title">Volunteers in Action</h2>
              <p className="vh-section-subtitle">See our community making a real difference</p>
            </div>

            <div className="vh-action-grid">
              {actions.map((action, idx) => (
                <article key={idx} className="vh-action-card">
                  <img
                    src={action.image}
                    alt={action.title}
                    className="vh-action-img"
                  />
                  <div className="vh-action-overlay">
                    <h3 className="vh-action-title">{action.title}</h3>
                    <p className="vh-action-desc">{action.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 5: TOP PARTNER CLUBS ─────────────────────── */}
        {/* Highlights institutional partners mapping through the 'clubs' array */}
        <section className="vh-clubs">
          <div className="vh-clubs-container">
            <div className="vh-section-header">
              <h2 className="vh-section-title">Top Partner Clubs</h2>
              <p className="vh-section-subtitle">Join events from our most active organizations</p>
            </div>

            <div className="vh-clubs-grid">
              {clubs.map((club, idx) => (
                <div key={idx} className="vh-club-card">
                  <div className="vh-club-banner">
                    <img
                      src={club.image}
                      alt={`${club.name} Banner`}
                      className="vh-club-banner-img"
                    />
                    <div className="vh-club-icon-overlay">
                      <span>{club.initials}</span>
                    </div>
                  </div>
                  <div className="vh-club-info">
                    <h3 className="vh-club-name">{club.name}</h3>
                    <span className="vh-club-events">{club.events}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 6: TESTIMONIALS ─────────────────────────── */}
        {/* Social proof section displaying user feedback */}
        <section className="vh-testimonials">
          <div className="vh-testimonials-container">
            <div className="vh-section-header">
              <h2 className="vh-section-title">What Students Say</h2>
              <p className="vh-section-subtitle">Real experiences from our volunteer community</p>
            </div>

            <div className="vh-testimonials-grid">
              {testimonials.map((t, idx) => (
                <div key={idx} className="vh-testimonial-wrapper">
                  <div className="vh-testimonial-bubble">
                    <p className="vh-testimonial-quote">
                      "{t.feedback}"
                    </p>
                  </div>
                  <div className="vh-testimonial-author">
                    <div className="vh-testimonial-avatar-wrapper">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="vh-testimonial-avatar"
                      />
                    </div>
                    <div className="vh-testimonial-meta">
                      <h4 className="vh-testimonial-name">{t.name}</h4>
                      <span className="vh-testimonial-role">{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer id="contact" className="vh-footer">
        <div className="vh-footer-container">
          <div className="vh-footer-grid">
            {/* Column 1: Brand Information */}
            <div className="vh-footer-col">
              <Link to="/" className="vh-footer-logo">
                <div className="vh-footer-logo-icon">
                  <HandHelping className="w-4 h-4" />
                </div>
                <span>VolunteerHub</span>
              </Link>
              <p className="vh-footer-tagline">
                Empowering students through meaningful volunteer opportunities.
              </p>
            </div>

            {/* Column 2: Site Navigation Links */}
            <div className="vh-footer-col">
              <h4>Quick Links</h4>
              <ul className="vh-footer-links">
                <li><a href="#home" className="vh-footer-link">About Us</a></li>
                <li><a href="#events" className="vh-footer-link">Events</a></li>
                <li><a href="#about" className="vh-footer-link">Partner Clubs</a></li>
                <li><a href="#contact" className="vh-footer-link">Contact</a></li>
              </ul>
            </div>

            {/* Column 3: Contact Details & Icons */}
            <div className="vh-footer-col">
              <h4>Contact</h4>
              <ul className="vh-footer-contact">
                <li>
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span>info@volunteerhub.edu</span>
                </li>
                <li>
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span>(555) 123-4567</span>
                </li>
                <li>
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>University Campus</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Social Media Integrations */}
            <div className="vh-footer-col">
              <h4>Follow Us</h4>
              <div className="vh-social-links">
                <a href="#" className="vh-social-btn" aria-label="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="vh-social-btn" aria-label="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="vh-social-btn" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright Information */}
          <div className="vh-footer-bottom">
            &copy; {new Date().getFullYear()} VolunteerHub. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;