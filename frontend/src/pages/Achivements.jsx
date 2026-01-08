import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/layout/header";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";
import { getMyAchievements, getAchievementStats } from "../services/achievementService";
import "./Achivements.css";

const Achivements = () => {
    const navigate = useNavigate();
    const { isOrganizer, isAuthenticated } = useAuth();
    const [achievements, setAchievements] = useState([]);
    const [stats, setStats] = useState({
        eventsAttended: 0,
        certifications: 0,
        prizes: 0,
        totalPoints: 0
    });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [achievementsRes, statsRes] = await Promise.all([
                    getMyAchievements(),
                    getAchievementStats()
                ]);

                if (achievementsRes.success) {
                    setAchievements(achievementsRes.data);
                }
                if (statsRes.success) {
                    setStats(statsRes.data);
                }
            } catch (error) {
                console.error("Error fetching achievement data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredAchievements = filter === 'all'
        ? achievements
        : achievements.filter(a => a.type === filter);

    const handleDownloadPDF = () => {
        alert('Your portfolio PDF is being generated. You will receive it via email shortly.');
    };

    const handleShare = (achievement) => {
        alert(`Sharing "${achievement.title}" to your profile!`);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Header />
                <div className="loading-spinner">Loading achievements...</div>
            </div>
        );
    }

    return (
        <div className="achievements-page">
            <Header />

            {/* Hero Section */}
            <section className="achievements-hero">
                <div className="achievements-container">
                    <h1>Your Achievement Portfolio</h1>
                    <p>Showcase all your certifications, prizes, and accomplishments from events you've participated in through our platform</p>
                    <div className="hero-actions">
                        <button className="btn btn-primary btn-large" onClick={handleDownloadPDF}>
                            <i className="fas fa-file-pdf"></i> Download Portfolio PDF
                        </button>
                        {isAuthenticated && isOrganizer && (
                            <button className="btn btn-outline-light btn-large" onClick={() => navigate('/organizer/manage-prizes')}>
                                <i className="fas fa-trophy"></i> Manage Event Prizes
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="achievements-container">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-calendar-check"></i>
                            </div>
                            <div className="stat-number">{stats.eventsAttended}</div>
                            <div className="stat-label">Events Attended</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-award"></i>
                            </div>
                            <div className="stat-number">{stats.certifications}</div>
                            <div className="stat-label">Certifications</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-trophy"></i>
                            </div>
                            <div className="stat-number">{stats.prizes}</div>
                            <div className="stat-label">Prizes Won</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-medal"></i>
                            </div>
                            <div className="stat-number">{stats.totalPoints}</div>
                            <div className="stat-label">Points Earned</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Achievements Section */}
            <section className="achievements-grid-section">
                <div className="achievements-container">
                    <div className="section-title">
                        <h2>Your Achievements</h2>
                        <p>All your accomplishments from events organized through our platform</p>
                    </div>

                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >All</button>
                        <button
                            className={`filter-btn ${filter === 'certification' ? 'active' : ''}`}
                            onClick={() => setFilter('certification')}
                        >Certifications</button>
                        <button
                            className={`filter-btn ${filter === 'prize' ? 'active' : ''}`}
                            onClick={() => setFilter('prize')}
                        >Prizes</button>
                        <button
                            className={`filter-btn ${filter === 'achievement' ? 'active' : ''}`}
                            onClick={() => setFilter('achievement')}
                        >Achievements</button>
                    </div>

                    {filteredAchievements.length > 0 ? (
                        <div className="achievements-grid">
                            {filteredAchievements.map((achievement) => (
                                <div key={achievement._id} className="achievement-card">
                                    <div className={`achievement-badge ${achievement.type}`}>
                                        <i className={`fas ${achievement.type === 'certification' ? 'fa-certificate' :
                                            achievement.type === 'prize' ? 'fa-trophy' : 'fa-medal'
                                            }`}></i>
                                    </div>
                                    <div className="achievement-content">
                                        <h3 className="achievement-title">{achievement.title}</h3>
                                        <div className="achievement-event">
                                            <i className="fas fa-calendar-alt"></i>
                                            {achievement.event?.title || 'Unknown Event'}
                                        </div>
                                        <div className="achievement-date">
                                            <i className="far fa-clock"></i>
                                            {achievement.type === 'certification' ? 'Completed: ' :
                                                achievement.type === 'prize' ? 'Awarded: ' : 'Achieved: '}
                                            {new Date(achievement.issuedDate).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                        <p className="achievement-description">
                                            {achievement.description || `Successfully earned this ${achievement.type} through our platform.`}
                                        </p>
                                        <div className="achievement-actions">
                                            <button className="btn btn-primary btn-small">
                                                View {achievement.type === 'certification' ? 'Certificate' : achievement.type === 'prize' ? 'Details' : 'Badge'}
                                            </button>
                                            <button
                                                className="btn btn-outline-dark btn-small"
                                                onClick={() => handleShare(achievement)}
                                            >Share</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-achievements">
                            <p>No achievements found for this category yet. Attend more events to earn them!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Certificates Section (Filtered for Certifications) */}
            {achievements.filter(a => a.type === 'certification').length > 0 && (
                <section className="certificates-section">
                    <div className="achievements-container">
                        <div className="section-title">
                            <h2>Your Certificates</h2>
                            <p>Digital certificates for all completed events and courses</p>
                        </div>

                        <div className="certificates-grid">
                            {achievements.filter(a => a.type === 'certification').map((cert) => (
                                <div key={cert._id} className="certificate-card">
                                    <div className="certificate-image">
                                        <i className="fas fa-file-signature"></i>
                                    </div>
                                    <div className="certificate-content">
                                        <h3 className="certificate-title">{cert.title}</h3>
                                        <div className="certificate-info">
                                            <i className="fas fa-calendar-alt"></i>
                                            Issued: {new Date(cert.issuedDate).toLocaleDateString()}
                                        </div>
                                        <p>{cert.description || 'Verified certification.'}</p>
                                        <div className="achievement-actions">
                                            <button className="btn btn-primary btn-small">View</button>
                                            <button className="btn btn-outline-dark btn-small">Download</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="cta-section">
                <div className="achievements-container">
                    <h2>Showcase Your Achievements</h2>
                    <p>Share your portfolio with employers, add to your LinkedIn profile, or include in your resume</p>
                    <button className="btn btn-primary btn-large">Share Portfolio</button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Achivements;
