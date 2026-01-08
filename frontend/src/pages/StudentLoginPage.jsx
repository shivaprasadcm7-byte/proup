import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/header";
import Footer from "../components/layout/Footer";
import "./Auth.css";

const StudentLoginPage = () => {
    const navigate = useNavigate();
    const { loginAsStudent } = useAuth();
    const [formData, setFormData] = useState({
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
        setLoading(true);

        try {
            await loginAsStudent(formData);
            navigate("/events");
        } catch (err) {
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />

            <div className="auth-container">
                <div className="auth-card">
                    <h2>Student Login</h2>
                    <p style={{ color: '#666', marginBottom: '1rem' }}>Login to discover events and opportunities</p>

                    {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
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
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "Login as Student"}
                        </button>
                    </form>

                    <p>
                        Don't have an account?{" "}
                        <Link to="/student/signup">Sign up as Student</Link>
                    </p>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default StudentLoginPage;
