import "./Footer.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleContactClick = (e) => {
    e.preventDefault();
    navigate("/contact");
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <h2>ProUp</h2>
        <p>Connecting students and organizers through meaningful events.</p>

        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Events</a>
          <a href="#" onClick={handleContactClick}>Contact</a>
        </div>

        <p className="copyright">
          © {new Date().getFullYear()} ProUp. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
