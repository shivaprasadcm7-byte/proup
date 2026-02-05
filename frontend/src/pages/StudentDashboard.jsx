import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/layout/header";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";
import eventService from "../services/eventService";
import "./StudentDashboard.css";

const StudentDashboard = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        eventsRegistered: 0,
        upcomingEvents: 0,
        achievements: 0,
        certificates: 0
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/student/login");
            return;
        }

        const fetchData = async () => {
            try {
                const response = await eventService.getAllEvents();
                const allEvents = response.data || [];
                setEvents(allEvents.slice(0, 4)); // Show first 4 events
                setStats({
                    eventsRegistered: Math.floor(Math.random() * 10) + 1,
                    upcomingEvents: allEvents.length,
                    achievements: Math.floor(Math.random() * 5),
                    certificates: Math.floor(Math.random() * 3)
                });
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, navigate]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <>
            <Header />

            <main className="dashboard student-dashboard">
                {/* Welcome Section */}
                <section className="dashboard-welcome">
                    <div className="container">
                        <div className="welcome-content">
                            <div className="welcome-text">
                                <h1>Welcome back, {user?.name || "Student"}! 👋</h1>
                                <p>Ready to discover new events and grow your skills?</p>
                            </div>
                            <div className="welcome-actions">
                                <Link to="/events" className="btn-primary">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="M21 21l-4.35-4.35" />
                                    </svg>
                                    Explore Events
                                </Link>
                                <Link to="/achievements" className="btn-secondary">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="8" r="6" />
                                        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                                    </svg>
                                    My Achievements
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="dashboard-stats">
                    <div className="container">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon events">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats.eventsRegistered}</span>
                                    <span className="stat-label">Events Registered</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon upcoming">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats.upcomingEvents}</span>
                                    <span className="stat-label">Upcoming Events</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon achievements">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="8" r="6" />
                                        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats.achievements}</span>
                                    <span className="stat-label">Achievements</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon certificates">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="16" y1="13" x2="8" y2="13" />
                                        <line x1="16" y1="17" x2="8" y2="17" />
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats.certificates}</span>
                                    <span className="stat-label">Certificates</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Upcoming Events Section */}
                <section className="dashboard-section">
                    <div className="container">
                        <div className="section-header">
                            <h2>Recommended Events</h2>
                            <Link to="/events" className="view-all-link">
                                View All
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </Link>
                        </div>

                        {loading ? (
                            <div className="loading-state">
                                <div className="loading-spinner"></div>
                                <p>Loading events...</p>
                            </div>
                        ) : events.length > 0 ? (
                            <div className="events-preview-grid">
                                {events.map((event) => (
                                    <div
                                        key={event._id}
                                        className="event-preview-card"
                                        onClick={() => navigate(`/event/${event._id}`)}
                                    >
                                        <div className="event-preview-image">
                                            <div className="image-placeholder">
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                    <line x1="16" y1="2" x2="16" y2="6" />
                                                    <line x1="8" y1="2" x2="8" y2="6" />
                                                    <line x1="3" y1="10" x2="21" y2="10" />
                                                </svg>
                                            </div>
                                            <span className="event-type-badge">{event.eventType || "Event"}</span>
                                        </div>
                                        <div className="event-preview-content">
                                            <h3>{event.title}</h3>
                                            <div className="event-preview-meta">
                                                <span>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                        <line x1="16" y1="2" x2="16" y2="6" />
                                                        <line x1="8" y1="2" x2="8" y2="6" />
                                                        <line x1="3" y1="10" x2="21" y2="10" />
                                                    </svg>
                                                    {formatDate(event.date)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>No events available at the moment.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Quick Links Section */}
                <section className="dashboard-section quick-links-section">
                    <div className="container">
                        <h2>Quick Actions</h2>
                        <div className="quick-links-grid">
                            <Link to="/events" className="quick-link-card">
                                <div className="quick-link-icon">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="M21 21l-4.35-4.35" />
                                    </svg>
                                </div>
                                <h3>Browse Events</h3>
                                <p>Discover new workshops and conferences</p>
                            </Link>

                            <Link to="/achievements" className="quick-link-card">
                                <div className="quick-link-icon">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="8" r="6" />
                                        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                                    </svg>
                                </div>
                                <h3>My Achievements</h3>
                                <p>View your certificates and badges</p>
                            </Link>

                            <Link to="/blog" className="quick-link-card">
                                <div className="quick-link-icon">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="16" y1="13" x2="8" y2="13" />
                                        <line x1="16" y1="17" x2="8" y2="17" />
                                    </svg>
                                </div>
                                <h3>Read Blog</h3>
                                <p>Tips and insights for your growth</p>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default StudentDashboard;
