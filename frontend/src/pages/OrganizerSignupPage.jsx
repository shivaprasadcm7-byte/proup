import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/header";
import Footer from "../components/layout/Footer";
import "./Auth.css";

const OrganizerSignupPage = () => {
    const navigate = useNavigate();
    const { signupAsOrganizer } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            await signupAsOrganizer(formData);
            navigate("/organizer/manage-prizes");
        } catch (err) {
            setError(err.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />

            <div className="auth-container">
                <div className="auth-card">
                    <h2>Create Organizer Account</h2>
                    <p style={{ color: '#666', marginBottom: '1rem' }}>Join as an organizer to create events</p>

                    {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password (min 6 characters)"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? "Creating Account..." : "Sign Up as Organizer"}
                        </button>
                    </form>

                    <p>
                        Already have an account?{" "}
                        <Link to="/organizer/login">Login as Organizer</Link>
                    </p>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default OrganizerSignupPage;
