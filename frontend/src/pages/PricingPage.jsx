import Header from "../components/layout/header";
import Footer from "../components/layout/Footer";
import "./PricingPage.css";

const PricingPage = () => {
    const plans = [
        {
            name: "Free",
            price: "₹0",
            period: "forever",
            description: "Perfect for getting started with event management",
            features: [
                "Up to 3 events per month",
                "50 attendees per event",
                "Basic analytics",
                "Email support",
                "Standard templates",
                "Community access"
            ],
            buttonText: "Get Started",
            buttonStyle: "secondary",
            popular: false
        },
        {
            name: "Pro",
            price: "₹999",
            period: "per month",
            description: "Best for growing organizations and teams",
            features: [
                "Unlimited events",
                "500 attendees per event",
                "Advanced analytics",
                "Priority email support",
                "Custom branding",
                "Certificate generation",
                "Team collaboration",
                "API access"
            ],
            buttonText: "Start Free Trial",
            buttonStyle: "primary",
            popular: true
        },
        {
            name: "Gold",
            price: "₹2,999",
            period: "per month",
            description: "For large enterprises with advanced needs",
            features: [
                "Everything in Pro",
                "Unlimited attendees",
                "Dedicated account manager",
                "24/7 phone support",
                "SSO integration",
                "Custom integrations",
                "SLA guarantee",
                "On-premise option",
                "White-label solution"
            ],
            buttonText: "Contact Sales",
            buttonStyle: "gold",
            popular: false
        }
    ];

    return (
        <div className="pricing-page">
            <Header />

            {/* Hero Section */}
            <section className="pricing-hero">
                <div className="pricing-hero-content">
                    <span className="pricing-badge">Pricing</span>
                    <h1>Simple, transparent pricing</h1>
                    <p>Choose the plan that's right for you and start creating amazing events today.</p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="pricing-section">
                <div className="pricing-grid">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`pricing-card ${plan.popular ? 'popular' : ''} ${plan.name.toLowerCase()}`}
                        >
                            {plan.popular && (
                                <span className="popular-badge">Most Popular</span>
                            )}

                            <div className="pricing-header">
                                <h2 className="plan-name">{plan.name}</h2>
                                <div className="plan-price">
                                    <span className="price">{plan.price}</span>
                                    <span className="period">/{plan.period}</span>
                                </div>
                                <p className="plan-description">{plan.description}</p>
                            </div>

                            <ul className="plan-features">
                                {plan.features.map((feature, i) => (
                                    <li key={i}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button className={`plan-button ${plan.buttonStyle}`}>
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="pricing-faq">
                <div className="faq-content">
                    <h2>Frequently Asked Questions</h2>

                    <div className="faq-grid">
                        <div className="faq-item">
                            <h3>Can I switch plans anytime?</h3>
                            <p>Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Is there a free trial?</h3>
                            <p>Yes! Pro plan comes with a 14-day free trial. No credit card required to start.</p>
                        </div>
                        <div className="faq-item">
                            <h3>What payment methods do you accept?</h3>
                            <p>We accept all major credit cards, UPI, net banking, and PayPal for international payments.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Do you offer refunds?</h3>
                            <p>Yes, we offer a 30-day money-back guarantee for all paid plans if you're not satisfied.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PricingPage;
