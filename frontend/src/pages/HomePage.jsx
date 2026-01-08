import Header from "../components/layout/header";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import Footer from "../components/layout/Footer";
import { FaUserGraduate, FaCalendarAlt } from "react-icons/fa";







const HomePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header />

      <section className="hero">
        <h2>Welcome to ProUp</h2>
        <p>Your gateway to events and opportunities</p>
      </section>
      <section className="role-selection">
        <div className="role-header">
          <h1>Choose Your Role</h1>
          <p>Select how you want to use ProUp</p>
        </div>

        <div className="roles-grid">
          <div className="role-card">
            <h2>Student</h2>
            <p>Discover events and opportunities</p>
            <button className="role-button student"
              onClick={() => navigate("/student/login")}>
              <FaUserGraduate size={22} style={{ marginRight: "10px" }} />
              Continue as Student
            </button>

          </div>

          <div className="role-card">
            <h2>Organizer</h2>
            <p>Create and manage events</p>
            <button className="role-button organizer"
              onClick={() => navigate("/organizer/login")}>
              <FaCalendarAlt size={22} style={{ marginRight: "10px" }} />
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
