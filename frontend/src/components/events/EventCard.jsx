const EventCard = ({ event, onClick, onSave, isSaved, viewMode }) => {
  return (
    <div className={`card ${viewMode === "list" ? "list-view" : ""}`}
      onClick={() => onClick(event)}>

      <img src={event.image} className="card-image" alt={event.title} />

      <div className="card-content">
        <h3 className="card-title">{event.title}</h3>

        <p className="card-description">
          {event.description.slice(0, 100)}...
        </p>

        <div className="card-footer">
          <span className="card-price">{event.price}</span>

          <button
            className={`save-btn ${isSaved ? "saved" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSave(event.id);
            }}
          >
            {isSaved ? "Registered" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
