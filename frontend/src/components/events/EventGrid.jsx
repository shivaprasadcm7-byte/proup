import EventCard from "./EventCard";

const EventGrid = ({ events, viewMode, onCardClick, onSave, savedEvents }) => {
  return (
    <div className={`grid ${viewMode === "list" ? "list-view" : ""}`}>
      {events.map(event => (
        <EventCard
          key={event.id}
          event={event}
          viewMode={viewMode}
          isSaved={savedEvents.includes(event.id)}
          onClick={onCardClick}
          onSave={onSave}
        />
      ))}
    </div>
  );
};

export default EventGrid;
