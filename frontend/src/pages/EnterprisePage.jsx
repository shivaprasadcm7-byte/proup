import Header from "../components/layout/header";
import Footer from "../components/layout/Footer";
import "./EnterprisePage.css";

const EnterprisePage = () => {
    const features = [
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            ),
            title: "Event Scheduling",
            description: "Intuitive scheduling tools with multi-track support, session management, and automated reminders for your attendees."
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
            title: "Attendee Management",
            description: "Seamless registration, ticketing, and check-in processes. Manage thousands of attendees with ease."
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                    <rect x="2" y="20" width="20" height="2" rx="1" />
                </svg>
            ),
            title: "Analytics & Insights",
            description: "Real-time dashboards and comprehensive reports to measure engagement and ROI for every event."
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            ),
            title: "Enterprise Security",
            description: "SOC 2 compliant with SSO integration, role-based access control, and data encryption at rest and in transit."
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
            ),
            title: "Automation",
            description: "Automate workflows, email campaigns, and follow-ups to save time and increase efficiency."
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
            ),
            title: "Global Scale",
            description: "Support for multiple time zones, languages, and currencies. Host events anywhere in the world."
        }
    ];

    return (
        <div className="enterprise-page">
            <Header />

            {/* Hero Section */}
            <section className="enterprise-hero">
                <div className="enterprise-hero-content">
                    <span className="enterprise-badge">Enterprise</span>
                    <h1>Built for large-scale organizations</h1>
                    <p>
                        ProUp Enterprise provides the tools, security, and scalability
                        that large organizations need to manage events at any scale.
                    </p>
                    <div className="enterprise-cta">
                        <button className="btn-primary">Contact Sales</button>
                        <button className="btn-secondary">View Demo</button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="enterprise-features">
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div className="feature-card" key={index}>
                            <div className="feature-icon">
                                {feature.icon}
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="enterprise-cta-section">
                <div className="cta-content">
                    <h2>Ready to transform your events?</h2>
                    <p>Get in touch with our enterprise team to learn how ProUp can help your organization.</p>
                    <button className="btn-primary">Schedule a Demo</button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default EnterprisePage;
