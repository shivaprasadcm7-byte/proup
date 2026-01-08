import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/header";
import Hero from "../components/layout/hero";
import EventCard from "../components/events/EventCard";
import eventService from "../services/eventService";

const EventsPage = () => {
  const [savedEvents, setSavedEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Filter logic
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "All" || event.eventType.toLowerCase() === filterType.toLowerCase();
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
      <Hero />

      {/* FILTER BAR GOES HERE */}
      <div className="filters">
        <div className="filters-inner">

          <div className="search-box">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search events"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="filter-dropdown"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>

        </div>
      </div>

      {/* EVENTS GRID */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading events...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>
      ) : (
        <div className="grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onClick={handleEventClick}
                onSave={handleSaveEvent}
                isSaved={savedEvents.includes(event._id)}
              />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', gridColumn: '1 / -1' }}>
              No events found matching your search.
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EventsPage;

