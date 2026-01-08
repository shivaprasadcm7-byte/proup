import React, { useState, useEffect } from 'react';
import Header from "../components/layout/header";
import Footer from "../components/layout/Footer";
import { getOrganizerEvents, getEventParticipants, awardAchievement } from "../services/achievementService";
import "./PrizeAssignment.css";

const OrganizerPrizeAssignment = () => {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalUser, setModalUser] = useState(null);
    const [achievementData, setAchievementData] = useState({
        type: 'certification',
        title: '',
        description: '',
        position: '',
        points: 10
    });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await getOrganizerEvents();
                if (res.success) {
                    setEvents(res.data);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        if (selectedEventId) {
            const fetchParticipants = async () => {
                try {
                    const res = await getEventParticipants(selectedEventId);
                    if (res.success) {
                        setParticipants(res.data);
                    }
                } catch (error) {
                    console.error("Error fetching participants:", error);
                }
            };
            fetchParticipants();
        } else {
            setParticipants([]);
        }
    }, [selectedEventId]);

    const handleOpenModal = (user) => {
        setModalUser(user);
        setAchievementData({
            type: 'certification',
            title: '',
            description: '',
            position: '',
            points: 15
        });
    };

    const handleCloseModal = () => {
        setModalUser(null);
    };

    const handleTypeChange = (e) => {
        const type = e.target.value;
        let points = 10;
        if (type === 'certification') points = 15;
        else if (type === 'prize') points = 50;

        setAchievementData({
            ...achievementData,
            type,
            points,
            title: type === 'certification' ? 'Certification of Completion' : achievementData.title
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await awardAchievement({
                ...achievementData,
                userId: modalUser._id,
                eventId: selectedEventId,
                position: achievementData.type === 'prize' ? Number(achievementData.position) : undefined
            });

            if (res.success) {
                alert("Achievement awarded successfully!");
                handleCloseModal();
                // Refresh participants to show new achievement
                const updatedParticipants = await getEventParticipants(selectedEventId);
                setParticipants(updatedParticipants.data);
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to award achievement");
        }
    };

    return (
        <div className="prize-assignment-page">
            <Header />

            <div className="prize-assignment-container">
                <div className="prize-assignment-header">
                    <h1>Manage Event Prizes & Awards</h1>
                    <p>Select an event and participant to award certifications or prizes.</p>
                </div>

                <div className="event-selection">
                    <div className="form-group">
                        <label htmlFor="eventSelect">Select Event</label>
                        <select
                            id="eventSelect"
                            className="form-control"
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(e.target.value)}
                        >
                            <option value="">-- Choose an event --</option>
                            {events.map(event => (
                                <option key={event._id} value={event._id}>
                                    {event.title} ({new Date(event.date).toLocaleDateString()})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedEventId && (
                    <div className="participants-section">
                        <h2>Participants ({participants.length})</h2>
                        {participants.length > 0 ? (
                            <table className="participants-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Existing Awards</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {participants.map(p => (
                                        <tr key={p._id}>
                                            <td>{p.name}</td>
                                            <td>{p.email}</td>
                                            <td>
                                                {p.achievements.map((a, i) => (
                                                    <span key={i} className="badge-tag">
                                                        {a.type === 'prize' ? `#${a.position} Prize` : a.type}
                                                    </span>
                                                ))}
                                                {p.achievements.length === 0 && <span style={{ color: '#ccc', fontSize: '0.8rem' }}>None</span>}
                                            </td>
                                            <td>
                                                <button className="award-btn" onClick={() => handleOpenModal(p)}>
                                                    Award
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{ marginTop: '20px', textAlign: 'center' }}>No participants registered for this event yet.</p>
                        )}
                    </div>
                )}
            </div>

            {modalUser && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Award Achievement</h2>
                        <p style={{ marginBottom: '20px' }}>Awarding to: <strong>{modalUser.name}</strong></p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Award Type</label>
                                <select
                                    className="form-control"
                                    value={achievementData.type}
                                    onChange={handleTypeChange}
                                >
                                    <option value="certification">Certification</option>
                                    <option value="prize">Prize</option>
                                    <option value="achievement">Special Achievement</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={achievementData.title}
                                    onChange={(e) => setAchievementData({ ...achievementData, title: e.target.value })}
                                    placeholder="e.g. 1st Place, Best Presenter"
                                />
                            </div>

                            {achievementData.type === 'prize' && (
                                <div className="form-group">
                                    <label>Position (1-3)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="1" max="3"
                                        required
                                        value={achievementData.position}
                                        onChange={(e) => setAchievementData({ ...achievementData, position: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label>Point Value</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={achievementData.points}
                                    onChange={(e) => setAchievementData({ ...achievementData, points: Number(e.target.value) })}
                                />
                                <p className="points-info">Recommended: Prize (50), Cert (15), Misc (10)</p>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-cancel" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn btn-award">Confirm Award</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default OrganizerPrizeAssignment;
