import { useState } from "react";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Send } from "lucide-react";

/**
 * ContactPage Component
 * 
 * Beautiful public Contact Us page featuring styled interactive information cards
 * and a fully operational (mocked) feedback/support submission form.
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
    <div>
      
      <section className="vh-hero" style={{ background: "var(--bg-white)", paddingBottom: "3rem" }}>
        <div className="vh-hero-container" style={{ gridTemplateColumns: "1fr", textAlign: "center" }}>
          <div className="vh-hero-content" style={{ alignItems: "center", margin: "0 auto", maxWidth: "600px" }}>
            <span className="vh-section-subtitle" style={{ textTransform: "uppercase" }}>Get in Touch</span>
            <h1 className="vh-hero-heading" style={{ fontSize: "2.75rem", marginTop: "0.5rem" }}>
              We'd Love to <span className="blue-highlight">Hear From You</span>
            </h1>
            <p className="vh-hero-subtext">
              Have questions about volunteering or hosting an event? Drop us a message, and we will get back to you shortly.
            </p>
          </div>
        </div>
      </section>

      <section className="vh-features" style={{ background: "var(--bg-body)", padding: "4rem 1.5rem" }}>
        <div className="vh-features-container" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "3rem" }}>
          
          {/* Left Column: Contact Details Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h2 className="vh-feature-title" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Contact Details</h2>
            
            {/* Phone Card */}
            <div className="vh-feature-card" style={{ padding: "1.5rem", gap: "1rem", flexDirection: "row", alignItems: "center" }}>
              <div className="vh-feature-icon-wrapper" style={{ flexShrink: 0 }}>
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="vh-feature-title" style={{ fontSize: "1.1rem" }}>Phone Support</h3>
                <p className="vh-feature-desc" style={{ marginTop: "0.25rem" }}>(555) 123-4567</p>
              </div>
            </div>

            {/* Email Card */}
            <div className="vh-feature-card" style={{ padding: "1.5rem", gap: "1rem", flexDirection: "row", alignItems: "center" }}>
              <div className="vh-feature-icon-wrapper" style={{ flexShrink: 0 }}>
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="vh-feature-title" style={{ fontSize: "1.1rem" }}>Email Inquiries</h3>
                <p className="vh-feature-desc" style={{ marginTop: "0.25rem" }}>info@volunteerhub.edu</p>
              </div>
            </div>

            {/* Office Location Card */}
            <div className="vh-feature-card" style={{ padding: "1.5rem", gap: "1rem", flexDirection: "row", alignItems: "center" }}>
              <div className="vh-feature-icon-wrapper" style={{ flexShrink: 0 }}>
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="vh-feature-title" style={{ fontSize: "1.1rem" }}>Main Campus Office</h3>
                <p className="vh-feature-desc" style={{ marginTop: "0.25rem" }}>Student Union, Wing B, Room 302</p>
              </div>
            </div>

            {/* Social Links Panel */}
            <div className="vh-feature-card" style={{ padding: "1.5rem", gap: "1rem" }}>
              <h3 className="vh-feature-title" style={{ fontSize: "1.1rem" }}>Follow Us</h3>
              <div className="vh-social-links" style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
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

          {/* Right Column: Contact/Feedback Form */}
          <div className="vh-feature-card" style={{ padding: "2.5rem", width: "100%", gap: "1.5rem" }}>
            <h2 className="vh-feature-title" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Send a Message</h2>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label htmlFor="name" style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)" }}>Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      padding: "0.65rem 0.85rem",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.95rem",
                      outline: "none"
                    }}
                  />
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label htmlFor="email" style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)" }}>Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      padding: "0.65rem 0.85rem",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.95rem",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <label htmlFor="subject" style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)" }}>Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  style={{
                    padding: "0.65rem 0.85rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.95rem",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <label htmlFor="message" style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)" }}>Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  style={{
                    padding: "0.65rem 0.85rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.95rem",
                    outline: "none",
                    resize: "vertical"
                  }}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitted}
                className="vh-btn-primary"
                style={{
                  alignSelf: "flex-start",
                  marginTop: "0.5rem",
                  width: "auto"
                }}
              >
                {submitted ? "Sending..." : "Send Message"} <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
};

export default ContactPage;
