import Header from "../components/layout/header";
import Footer from "../components/layout/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import eventService from "../services/eventService";
import "./OrganizerCreateEvent.css";

const OrganizerCreateEvent = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isOrganizer } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    price: "",
    description: "",
    eventType: "offline",
    duration: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload a valid image");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const { title, category, date, time, location, capacity } = formData;

    if (!title || !category || !date || !time || !location || !capacity) {
      alert("Please fill all required fields");
      return;
    }

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!isOrganizer) {
      alert("Only organizers can create events");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let imageUrl = "https://images.unsplash.com/photo-1540575467063-178a50c2df87";

      // Upload image if one is selected
      if (image) {
        const uploadResponse = await eventService.uploadImage(image);
        if (uploadResponse.success) {
          imageUrl = uploadResponse.data.imageUrl;
        }
      }

      // Format data for backend
      const eventData = {
        title: formData.title,
        category: formData.category,
        date: formData.date,
        description: formData.description,
        location: formData.location,
        price: formData.price || "Free",
        eventType: formData.eventType,
        duration: formData.duration || `${formData.time}`,
        capacity: formData.capacity,
        image: imageUrl,
        popularity: 50,
      };

      await eventService.createEvent(eventData);
      alert("Event Created Successfully! 🎉");
      navigate("/events");
    } catch (err) {
      setError(err.message || "Failed to create event");
      alert(err.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="container">
        <div className="main-content">
          <section className="event-form-section">
            <div className="section-title">
              <h2>Create Your Event</h2>
              <p>Fill out the form below to set up your event</p>
            </div>

            <div className="form-container">
              <div className="form-header">
                <h3>Event Details</h3>
              </div>

              <div className="form-body">
                {/* IMAGE UPLOAD */}
                <div className="form-group">
                  <label>Event Banner *</label>
                  <label className="upload-box">
                    {preview ? (
                      <img src={preview} alt="preview" className="upload-preview" />
                    ) : (
                      <div className="upload-placeholder">
                        📷 Click to upload event image
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Event Name *</label>
                    <input
                      name="title"
                      className="form-control"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      className="form-control"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Science">Science</option>
                      <option value="Wellness">Wellness</option>
                      <option value="Career">Career</option>
                      <option value="Finance">Finance</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Technology">Technology</option>
                      <option value="Education">Education</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Time *</label>
                    <input
                      type="time"
                      name="time"
                      className="form-control"
                      value={formData.time}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Event Type *</label>
                    <select
                      name="eventType"
                      className="form-control"
                      value={formData.eventType}
                      onChange={handleChange}
                    >
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Duration</label>
                    <input
                      name="duration"
                      placeholder="e.g., 2 hours, 3 days"
                      className="form-control"
                      value={formData.duration}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Location *</label>
                    <input
                      name="location"
                      className="form-control"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Total Slots *</label>
                    <input
                      type="text"
                      name="capacity"
                      placeholder="e.g., 100 attendees"
                      className="form-control"
                      value={formData.capacity}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input
                    name="price"
                    placeholder="e.g., $50 or Free"
                    className="form-control"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-footer">
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Event"}
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default OrganizerCreateEvent;
