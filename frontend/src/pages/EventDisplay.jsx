import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/header";
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
                // Could implement unregister functionality here
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

    if (loading) {
        return (
            <>
                <Header />
                <div className="event-display-container">
                    <div style={{ textAlign: 'center', padding: '2rem' }}>Loading event...</div>
                </div>
            </>
        );
    }

    // If event not found, show error
    if (!event || error) {
        return (
            <>
                <Header />
                <div className="event-display-container">
                    <div className="error-message">
                        <h2>Event Not Found</h2>
                        <button onClick={() => navigate("/events")} className="back-btn">
                            Back to Events
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="event-display-container">
                <button onClick={() => navigate("/events")} className="back-btn">
                    ← Back to Events
                </button>

                <div className="event-display-content">
                    <div className="event-image-section">
                        <img src={event.image} alt={event.title} className="event-main-image" />
                    </div>

                    <div className="event-info-section">
                        <div className="event-header">
                            <h1 className="event-title">{event.title}</h1>
                            <span className="event-category">{event.category}</span>
                        </div>

                        <div className="event-meta">
                            <div className="meta-item">
                                <i className="fas fa-calendar"></i>
                                <span>{event.date}</span>
                            </div>
                            {event.location && (
                                <div className="meta-item">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span>{event.location}</span>
                                </div>
                            )}
                            {event.duration && (
                                <div className="meta-item">
                                    <i className="fas fa-clock"></i>
                                    <span>{event.duration}</span>
                                </div>
                            )}
                            {event.capacity && (
                                <div className="meta-item">
                                    <i className="fas fa-users"></i>
                                    <span>{event.capacity}</span>
                                </div>
                            )}
                        </div>

                        <div className="event-description">
                            <h2>About This Event</h2>
                            <p>{event.description}</p>
                        </div>

                        <div className="event-type-badge">
                            <span className={`type-badge ${event.eventType}`}>
                                {event.eventType === "online" && "🌐 Online"}
                                {event.eventType === "offline" && "📍 In-Person"}
                                {event.eventType === "hybrid" && "🔄 Hybrid"}
                            </span>
                        </div>

                        <div className="event-footer">
                            <div className="event-price-section">
                                <span className="price-label">Price</span>
                                <span className="event-price">{event.price}</span>
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
        </>
    );
};

export default EventDisplay;
