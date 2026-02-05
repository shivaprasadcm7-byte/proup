import "./EventCard.css";

const EventCard = ({ event, onClick, onSave, isSaved, isFeatured }) => {
  // Calculate capacity percentage with proper number handling
  const capacity = Number(event.capacity) || 100;
  const registered = Number(event.registeredCount) || 0;
  const capacityPercent = capacity > 0 ? Math.round((registered / capacity) * 100) : 0;

  // Determine event type for badge styling
  const getEventType = () => {
    const type = event.eventType?.toLowerCase() || 'conference';
    if (type.includes('workshop')) return 'workshop';
    if (type.includes('corporate')) return 'corporate';
    return 'conference';
  };

  const eventType = getEventType();
  const typeLabel = eventType.charAt(0).toUpperCase() + eventType.slice(1);

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="event-card" onClick={() => onClick(event)}>
      {/* Card Header with Icon */}
      <div className="event-card-header">
        {isFeatured && <span className="featured-badge">Featured</span>}
        <div className="event-card-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
      </div>

      {/* Card Content */}
      <div className="event-card-content">
        {/* Type Badge */}
        <span className={`event-type-badge ${eventType}`}>
          {typeLabel}
        </span>

        {/* Title */}
        <h3 className="event-card-title">{event.title}</h3>

        {/* Meta Info */}
        <div className="event-card-meta">
          <div className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{event.location || event.venue || 'Online'}</span>
          </div>
          <div className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>{registered} / {capacity} registered</span>
          </div>
        </div>

        {/* Capacity Progress */}
        <div className="event-card-capacity">
          <div className="capacity-header">
            <span className="capacity-label">Capacity</span>
            <span className="capacity-percent">{capacityPercent}%</span>
          </div>
          <div className="capacity-bar">
            <div
              className="capacity-fill"
              style={{ width: `${capacityPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
