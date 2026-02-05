import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StudentLoginPage from "./pages/StudentLoginPage";
import StudentSignupPage from "./pages/StudentSignupPage";
import OrganizerLoginPage from "./pages/OrganizerLoginPage";
import OrganizerSignupPage from "./pages/OrganizerSignupPage";
import EventsPage from "./pages/EventsPage";
import OrganizerCreateEvent from "./pages/OrganizerCreateEvent";
import ContactPage from "./pages/ContactPage";
import Achivements from "./pages/Achivements";
import EventDisplay from "./pages/EventDisplay";
import OrganizerPrizeAssignment from "./pages/OrganizerPrizeAssignment";
import EnterprisePage from "./pages/EnterprisePage";
import PricingPage from "./pages/PricingPage";
import BlogPage from "./pages/BlogPage";
import StudentDashboard from "./pages/StudentDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";


const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/student/login" element={<StudentLoginPage />} />
          <Route path="/student/signup" element={<StudentSignupPage />} />
          <Route path="/organizer/login" element={<OrganizerLoginPage />} />
          <Route path="/organizer/signup" element={<OrganizerSignupPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/event/:id" element={<EventDisplay />} />
          <Route path="/organizer/create-event" element={<OrganizerCreateEvent />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/achievements" element={<Achivements />} />
          <Route path="/organizer/manage-prizes" element={<OrganizerPrizeAssignment />} />
          <Route path="/enterprise" element={<EnterprisePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
