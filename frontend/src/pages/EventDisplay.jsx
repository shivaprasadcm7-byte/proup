import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/header";
import Footer from "../components/layout/Footer";
import eventService from "../services/eventService";
import registrationService from "../services/registrationService";
import "./EventDisplay.css";

const EventDisplay = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [event, setEvent] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [error, setError] = useState("");

    // Fetch event data
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const response = await eventService.getEventById(id);
                setEvent(response.data);

                // Check if user is already registered
                if (isAuthenticated) {
                    const regResponse = await registrationService.checkRegistration(id);
                    setIsRegistered(regResponse.isRegistered);
                }
            } catch (err) {
                setError("Failed to load event");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id, isAuthenticated]);

    const handleRegister = async () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        try {
            setRegistering(true);
            if (isRegistered) {
                alert("You are already registered for this event");
            } else {
                await registrationService.registerForEvent(id);
                setIsRegistered(true);
                alert("Successfully registered for the event!");
            }
        } catch (err) {
            alert(err.message || "Failed to register for event");
        } finally {
            setRegistering(false);
        }
    };

    // Format date
    const formatDate = (dateStr) => {
        if (!dateStr) return 'TBD';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="event-display-page">
                <Header />
                <div className="event-display-container">
                    <div className="event-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading event details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!event || error) {
        return (
            <div className="event-display-page">
                <Header />
                <div className="event-display-container">
                    <div className="event-error">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <h2>Event Not Found</h2>
                        <button onClick={() => navigate("/events")} className="back-btn">
                            Back to Events
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="event-display-page">
            <Header />
            <div className="event-display-container">
                <button onClick={() => navigate("/events")} className="back-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5" />
                        <path d="M12 19l-7-7 7-7" />
                    </svg>
                    Back to Events
                </button>

                <div className="event-display-content">
                    <div className="event-image-section">
                        {event.image ? (
                            <img src={event.image} alt={event.title} className="event-main-image" />
                        ) : (
                            <div className="event-image-placeholder">
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </div>
                        )}
                    </div>

                    <div className="event-info-section">
                        <div className="event-header">
                            <span className="event-category">{event.category || 'Event'}</span>
                            <h1 className="event-title">{event.title}</h1>
                        </div>

                        <div className="event-meta">
                            <div className="meta-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                <span>{formatDate(event.date)}</span>
                            </div>
                            {event.location && (
                                <div className="meta-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span>{event.location}</span>
                                </div>
                            )}
                            {event.duration && (
                                <div className="meta-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    <span>{event.duration}</span>
                                </div>
                            )}
                            {event.capacity && (
                                <div className="meta-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                    <span>{event.capacity} capacity</span>
                                </div>
                            )}
                        </div>

                        <div className="event-description">
                            <h2>About This Event</h2>
                            <p>{event.description}</p>
                        </div>

                        <div className="event-type-badge">
                            <span className={`type-badge ${event.eventType}`}>
                                {event.eventType === "online" && "🌐 Online Event"}
                                {event.eventType === "offline" && "📍 In-Person Event"}
                                {event.eventType === "hybrid" && "🔄 Hybrid Event"}
                            </span>
                        </div>

                        <div className="event-footer">
                            <div className="event-price-section">
                                <span className="price-label">Price</span>
                                <span className="event-price">{event.price || 'Free'}</span>
                            </div>

                            <button
                                onClick={handleRegister}
                                className={`register-btn ${isRegistered ? "registered" : ""}`}
                                disabled={registering}
                            >
                                {registering ? "Processing..." : isRegistered ? "✓ Registered" : "Register Now"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EventDisplay;
