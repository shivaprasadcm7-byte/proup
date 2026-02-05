import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/layout/header";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";
import eventService from "../services/eventService";
import "./OrganizerDashboard.css";

const OrganizerDashboard = () => {
    const { user, isAuthenticated, isOrganizer } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEvents: 0,
        activeEvents: 0,
        totalRegistrations: 0,
        upcomingEvents: 0
    });

    useEffect(() => {
        if (!isAuthenticated || !isOrganizer) {
            navigate("/organizer/login");
            return;
        }

        const fetchData = async () => {
            try {
                const response = await eventService.getAllEvents();
                const allEvents = response.data || [];
                setEvents(allEvents.slice(0, 5)); // Show first 5 events
                setStats({
                    totalEvents: allEvents.length,
                    activeEvents: Math.floor(allEvents.length * 0.7),
                    totalRegistrations: allEvents.length * 25,
                    upcomingEvents: Math.ceil(allEvents.length * 0.5)
                });
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, isOrganizer, navigate]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <>
            <Header />

            <main className="dashboard organizer-dashboard">
                {/* Welcome Section */}
                <section className="dashboard-welcome organizer-welcome">
                    <div className="container">
                        <div className="welcome-content">
                            <div className="welcome-text">
                                <h1>Organizer Dashboard</h1>
                                <p>Welcome back, {user?.name || "Organizer"}! Manage your events and track performance.</p>
                            </div>
                            <div className="welcome-actions">
                                <Link to="/organizer/create-event" className="btn-primary">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="16" />
                                        <line x1="8" y1="12" x2="16" y2="12" />
                                    </svg>
                                    Create Event
                                </Link>
                                <Link to="/contact" className="btn-secondary">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="dashboard-stats">
                    <div className="container">
                        <div className="stats-grid organizer-stats">
                            <div className="stat-card">
                                <div className="stat-icon total">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats.totalEvents}</span>
                                    <span className="stat-label">Total Events</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon active">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="16 12 12 8 8 12" />
                                        <line x1="12" y1="16" x2="12" y2="8" />
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats.activeEvents}</span>
                                    <span className="stat-label">Active Events</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon registrations">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats.totalRegistrations}</span>
                                    <span className="stat-label">Total Registrations</span>
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
                        </div>
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="dashboard-section quick-actions-section">
                    <div className="container">
                        <h2>Quick Actions</h2>
                        <div className="quick-actions-grid">
                            <Link to="/organizer/create-event" className="action-card primary">
                                <div className="action-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="16" />
                                        <line x1="8" y1="12" x2="16" y2="12" />
                                    </svg>
                                </div>
                                <h3>Create New Event</h3>
                                <p>Set up a new workshop, conference, or meetup</p>
                            </Link>

                            <Link to="/organizer/manage-prizes" className="action-card">
                                <div className="action-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                                        <path d="M4 22h16" />
                                        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                                        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                                        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                                    </svg>
                                </div>
                                <h3>Manage Prizes</h3>
                                <p>Assign and manage event prizes</p>
                            </Link>

                            <Link to="/events" className="action-card">
                                <div className="action-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="7" height="7" />
                                        <rect x="14" y="3" width="7" height="7" />
                                        <rect x="14" y="14" width="7" height="7" />
                                        <rect x="3" y="14" width="7" height="7" />
                                    </svg>
                                </div>
                                <h3>View All Events</h3>
                                <p>Browse and manage your events</p>
                            </Link>

                            <Link to="/contact" className="action-card">
                                <div className="action-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </div>
                                <h3>Request Demo</h3>
                                <p>Get personalized support and demos</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Recent Events Table */}
                <section className="dashboard-section events-table-section">
                    <div className="container">
                        <div className="section-header">
                            <h2>Recent Events</h2>
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
                            <div className="events-table-wrapper">
                                <table className="events-table">
                                    <thead>
                                        <tr>
                                            <th>Event Name</th>
                                            <th>Type</th>
                                            <th>Date</th>
                                            <th>Registrations</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {events.map((event) => (
                                            <tr key={event._id}>
                                                <td className="event-name-cell">
                                                    <span className="event-title">{event.title}</span>
                                                </td>
                                                <td>
                                                    <span className="type-badge">{event.eventType || "Event"}</span>
                                                </td>
                                                <td>{formatDate(event.date)}</td>
                                                <td>{Math.floor(Math.random() * 50) + 10}</td>
                                                <td>
                                                    <span className="status-badge active">Active</span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="table-action-btn"
                                                        onClick={() => navigate(`/event/${event._id}`)}
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                <h3>No events yet</h3>
                                <p>Create your first event to get started</p>
                                <Link to="/organizer/create-event" className="btn-primary">
                                    Create Event
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default OrganizerDashboard;
