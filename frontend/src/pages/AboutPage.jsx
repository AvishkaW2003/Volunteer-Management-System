import { useState, useEffect } from "react";
import {
  Calendar, Award, Star, CheckCircle, Trophy, Bell
} from "lucide-react";

/**
 * AnimatedCounter Component
 */
const AnimatedCounter = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16); 
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <span className="vh-stat-number">
      {count}{suffix}
    </span>
  );
};

/**
 * AboutPage Component
 */
const AboutPage = () => {
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

  return (
    <div>
      
      {/* Intro Mission Statement */}
      <section className="vh-hero" style={{ background: "var(--bg-white)", paddingBottom: "3rem" }}>
        <div className="vh-hero-container" style={{ gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
          <div className="vh-hero-content">
            <span className="vh-section-subtitle" style={{ textTransform: "uppercase" }}>Our Vision</span>
            <h1 className="vh-hero-heading" style={{ fontSize: "2.75rem", marginTop: "0.5rem" }}>
              Connecting Students with <span className="blue-highlight">Purposeful Impact</span>
            </h1>
            <p className="vh-hero-subtext">
              VolunteerHub is dedicated to building a supportive community of students and organizers. We streamline event management, attendance verification, and performance gamification to make student participation in volunteer projects simple, accessible, and deeply rewarding.
            </p>
          </div>
          <div className="vh-hero-media">
            <div className="vh-hero-image-card" style={{ maxWidth: "420px" }}>
              <div className="vh-hero-image-wrapper" style={{ height: "260px" }}>
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80"
                  alt="Students collaborating"
                  className="vh-hero-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="vh-features" style={{ background: "var(--bg-body)", padding: "5rem 1.5rem" }}>
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

      {/* Dynamic Statistics Banner */}
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

    </div>
  );
};

export default AboutPage;
