import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/header";
import EventCard from "../components/events/EventCard";
import eventService from "../services/eventService";
import "./EventsPage.css";

const EventsPage = () => {
  const [savedEvents, setSavedEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [dateFilter, setDateFilter] = useState("Upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Filter logic
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "All" || event.eventType?.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventService.getAllEvents();
        setEvents(response.data || []);
      } catch (err) {
        setError("Failed to load events. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handler to toggle save/unsave events
  const handleSaveEvent = (eventId) => {
    setSavedEvents((prev) => {
      if (prev.includes(eventId)) {
        return prev.filter((id) => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };

  // Handler for card clicks - navigate to event details page
  const handleEventClick = (event) => {
    navigate(`/event/${event._id}`);
  };

  return (
    <>
      <Header />

      {/* Filter Bar */}
      <div className="filters">
        <div className="filters-inner">
          <div className="search-box">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="filter-dropdown"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Conference">Conference</option>
            <option value="Workshop">Workshop</option>
            <option value="Corporate">Corporate</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>

          <select
            className="filter-dropdown"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="Upcoming">Upcoming</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="Past">Past Events</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <main className="events-main">
        {loading ? (
          <div className="events-loading">
            <div className="loading-spinner"></div>
            <p>Loading events...</p>
          </div>
        ) : error ? (
          <div className="events-error">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>{error}</p>
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onClick={handleEventClick}
                  onSave={handleSaveEvent}
                  isSaved={savedEvents.includes(event._id)}
                  isFeatured={index === 0}
                />
              ))
            ) : (
              <div className="events-empty">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <h3>No events found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default EventsPage;
