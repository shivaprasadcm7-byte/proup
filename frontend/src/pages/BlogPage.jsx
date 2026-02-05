import { useState } from "react";
import Header from "../components/layout/header";
import Footer from "../components/layout/Footer";
import "./BlogPage.css";

// Sample blog data
const blogPosts = [
    {
        id: 1,
        title: "How to Maximize Your Event Experience",
        excerpt: "Learn the best strategies to get the most out of every event you attend, from networking tips to active participation techniques.",
        category: "Tips & Guides",
        author: "Sarah Johnson",
        date: "2026-01-20",
        readTime: "5 min read",
        image: null
    },
    {
        id: 2,
        title: "The Future of Virtual Events in 2026",
        excerpt: "Discover the latest trends in virtual event technology and how they're reshaping the way we connect and learn.",
        category: "Industry Insights",
        author: "Michael Chen",
        date: "2026-01-18",
        readTime: "7 min read",
        image: null
    },
    {
        id: 3,
        title: "Building Your Professional Portfolio Through Events",
        excerpt: "A comprehensive guide on how to leverage event certifications and achievements to boost your career prospects.",
        category: "Career Growth",
        author: "Emily Rodriguez",
        date: "2026-01-15",
        readTime: "6 min read",
        image: null
    },
    {
        id: 4,
        title: "Organizing Successful Corporate Workshops",
        excerpt: "Expert tips for organizers on planning and executing workshops that deliver real value to attendees.",
        category: "For Organizers",
        author: "David Kim",
        date: "2026-01-12",
        readTime: "8 min read",
        image: null
    }
];

const categories = ["All", "Tips & Guides", "Industry Insights", "Career Growth", "For Organizers"];

const BlogPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPosts = blogPosts.filter(post => {
        const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    return (
        <>
            <Header />

            <main className="blog-page">
                {/* Hero Section */}
                <section className="blog-hero">
                    <div className="container">
                        <h1>ProUp Blog</h1>
                        <p>Insights, tips, and stories from the world of events and professional development</p>
                    </div>
                </section>

                {/* Filter Section */}
                <section className="blog-filters">
                    <div className="container">
                        <div className="filters-row">
                            <div className="search-box">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="M21 21l-4.35-4.35" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="category-filters">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(category)}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Blog Grid */}
                <section className="blog-content">
                    <div className="container">
                        {filteredPosts.length > 0 ? (
                            <div className="blog-grid">
                                {filteredPosts.map((post, index) => (
                                    <article key={post.id} className={`blog-card ${index === 0 ? 'featured' : ''}`}>
                                        <div className="blog-card-image">
                                            <div className="image-placeholder">
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                                    <polyline points="21 15 16 10 5 21" />
                                                </svg>
                                            </div>
                                            <span className="category-badge">{post.category}</span>
                                        </div>
                                        <div className="blog-card-content">
                                            <h2>{post.title}</h2>
                                            <p>{post.excerpt}</p>
                                            <div className="blog-meta">
                                                <span className="author">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                        <circle cx="12" cy="7" r="4" />
                                                    </svg>
                                                    {post.author}
                                                </span>
                                                <span className="date">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                        <line x1="16" y1="2" x2="16" y2="6" />
                                                        <line x1="8" y1="2" x2="8" y2="6" />
                                                        <line x1="3" y1="10" x2="21" y2="10" />
                                                    </svg>
                                                    {formatDate(post.date)}
                                                </span>
                                                <span className="read-time">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <polyline points="12 6 12 12 16 14" />
                                                    </svg>
                                                    {post.readTime}
                                                </span>
                                            </div>
                                            <button className="read-more-btn">
                                                Read Article
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                    <polyline points="12 5 19 12 12 19" />
                                                </svg>
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="no-results">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <h3>No articles found</h3>
                                <p>Try adjusting your search or filter criteria</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default BlogPage;
