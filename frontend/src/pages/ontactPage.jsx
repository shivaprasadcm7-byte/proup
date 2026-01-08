import Header from "../components/layout/header";
import Footer from "../components/layout/Footer";
import "./ContactPage.css";

const ContactPage = () => {
  return (
    <>
      <Header />

      <section className="contact-hero">
        <h2>Contact Us</h2>
        <p>Find Your Next Experience</p>
      </section>

      <div className="contact-container">
        <div className="contact-info">
          <h3>Get In Touch</h3>

          <div className="contact-card">
            <h4>📍 Address</h4>
            <p>4671 PES College, Mandya</p>
          </div>

          <div className="contact-card">
            <h4>📞 Phone</h4>
            <p>+91 8431588553</p>
          </div>

          <div className="contact-card">
            <h4>✉️ Email</h4>
            <p>abcd@email.com</p>
          </div>
        </div>

        <form className="contact-form">
          <h3>Send Message</h3>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email" required />
          <textarea placeholder="Your Message" required />
          <button type="submit">Send Message</button>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default ContactPage;
