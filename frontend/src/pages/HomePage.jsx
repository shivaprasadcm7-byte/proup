import Header from "../components/layout/header";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import Footer from "../components/layout/Footer";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      {/* Role Selection Section */}
      <section className="role-selection">
        <div className="role-header">
          <h1>Choose Your Role</h1>
          <p>Select how you want to use ProUp</p>
        </div>

        <div className="roles-grid">
          <div className="role-card">
            <div className="role-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <h2>Student</h2>
            <p>Discover and register for events, workshops, and conferences to enhance your skills</p>
            <button
              className="role-button student"
              onClick={() => navigate("/student/login")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              Continue as Student
            </button>
          </div>

          <div className="role-card">
            <div className="role-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h2>Organizer</h2>
            <p>Create, manage, and track your events with powerful analytics and tools</p>
            <button
              className="role-button organizer"
              onClick={() => navigate("/organizer/login")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Continue as Organizer
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
