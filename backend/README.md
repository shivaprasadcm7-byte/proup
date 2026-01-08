# Proup Backend API

Backend server for Proup events management application.

## Features

- RESTful API for events management
- User authentication with JWT
- Event registration system
- Role-based authorization (Organizers/Attendees)
- MongoDB database integration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
MONGODB_URI=mongodb://localhost:27017/proup-events
JWT_SECRET=your-secret-key
PORT=5000
```

3. Seed the database with initial events:
```bash
npm run seed
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/verify` - Verify JWT token

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (organizers only)
- `PUT /api/events/:id` - Update event (organizer only)
- `DELETE /api/events/:id` - Delete event (organizer only)

### Registrations
- `POST /api/registrations` - Register for event
- `GET /api/registrations/user/:userId` - Get user registrations
- `GET /api/registrations/check/:eventId` - Check registration status
- `DELETE /api/registrations/:id` - Cancel registration

## Tech Stack

- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation
