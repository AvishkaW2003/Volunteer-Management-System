import { useState } from "react";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Send } from "lucide-react";
import "./ContactPage.css";

/**
 * ContactPage Component
 * 
 * Professional Contact Us page featuring styled info cards with section preview images,
 * campus visual preview banner, and a 3D contact form cleanly formatted for a single-screen view.
 */
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      // Simulate API call
      setTimeout(() => {
        setFormData({ name: "", email: "", subject: "", message: "" });
        setSubmitted(false);
        alert("Thank you! Your message has been received.");
      }, 1000);
    }
  };

  return (
    <div className="contact-page-wrapper">
      {/* Background Decorative Glow Orbs */}
      <div className="contact-bg-glow contact-glow-1"></div>
      <div className="contact-bg-glow contact-glow-2"></div>

      <div className="contact-single-screen-container">
        {/* Compact Hero Header Section */}
        <div className="contact-hero-compact">
          <div className="contact-badge">
            <span className="contact-badge-dot"></span>
            Get in Touch
          </div>
          <h1 className="contact-hero-heading">
            We'd Love to <span className="contact-gradient-text">Hear From You</span>
          </h1>
          <p className="contact-hero-subtext">
            Have questions about volunteering or hosting an event? Drop us a message, and we will get back to you shortly.
          </p>
        </div>

        {/* Main Content Grid (Side-by-side fit) */}
        <div className="contact-grid">
          
          {/* Left Column: Contact Details Cards & Image Banner */}
          <div className="contact-info-column">
            <h2 className="contact-section-title">Contact Details</h2>
            
            {/* Professional Campus Image Banner Card */}
            <div className="contact-image-banner-card">
              <img 
                src="/images/community.jpg" 
                alt="Volunteer Hub Headquarters" 
              />
              <div className="contact-image-banner-overlay">
                <div className="contact-image-banner-badge">
                  <span className="contact-badge-dot" style={{ backgroundColor: "#ffffff", boxShadow: "0 0 6px #ffffff" }}></span>
                  Volunteer Hub HQ
                </div>
                <h4 className="contact-image-banner-title">Community Support Center</h4>
              </div>
            </div>

            {/* Phone Support Card */}
            <div className="contact-info-card" style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                <div className="contact-icon-box">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="contact-info-content">
                  <h3>Phone Support</h3>
                  <p>(555) 123-4567</p>
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=200&q=80" 
                alt="Phone Support Representative" 
                style={{ width: "44px", height: "44px", borderRadius: "0.65rem", objectFit: "cover", flexShrink: 0, opacity: 0.9, border: "1px solid rgba(226, 232, 240, 0.8)" }} 
              />
            </div>

            {/* Email Inquiries Card */}
            <div className="contact-info-card" style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                <div className="contact-icon-box">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="contact-info-content">
                  <h3>Email Inquiries</h3>
                  <p>info@volunteerhub.edu</p>
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=200&q=80" 
                alt="Email Support Desk" 
                style={{ width: "44px", height: "44px", borderRadius: "0.65rem", objectFit: "cover", flexShrink: 0, opacity: 0.9, border: "1px solid rgba(226, 232, 240, 0.8)" }} 
              />
            </div>

            {/* Main Campus Office Card */}
            <div className="contact-info-card" style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                <div className="contact-icon-box">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="contact-info-content">
                  <h3>Main Campus Office</h3>
                  <p>Student Union, Wing B, Room 302</p>
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80" 
                alt="Main Campus Office Building" 
                style={{ width: "44px", height: "44px", borderRadius: "0.65rem", objectFit: "cover", flexShrink: 0, opacity: 0.9, border: "1px solid rgba(226, 232, 240, 0.8)" }} 
              />
            </div>

            {/* Social Links Panel */}
            <div className="contact-social-card">
              <h3 className="contact-info-content" style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#0f172a" }}>
                Follow Us
              </h3>
              <div className="contact-social-list">
                <a href="#" className="contact-social-icon-btn" aria-label="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="contact-social-icon-btn" aria-label="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="contact-social-icon-btn" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Contact/Feedback Form */}
          <div className="contact-form-card">
            <h2 className="contact-section-title" style={{ marginBottom: "0.75rem" }}>Send a Message</h2>
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-form-row">
                <div className="contact-field-group">
                  <label htmlFor="name" className="contact-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="contact-input"
                  />
                </div>
                
                <div className="contact-field-group">
                  <label htmlFor="email" className="contact-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="contact-input"
                  />
                </div>
              </div>

              <div className="contact-field-group">
                <label htmlFor="subject" className="contact-label">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="contact-input"
                />
              </div>

              <div className="contact-field-group">
                <label htmlFor="message" className="contact-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="contact-textarea"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitted}
                className="contact-submit-btn"
              >
                {submitted ? "Sending..." : "Send Message"} <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
