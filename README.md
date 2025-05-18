# MovieRate

A full-stack web application for discovering, rating, and managing movies. Built with Spring Boot (Java) for the backend and Angular for the frontend, MovieRate allows users to browse movies, rate them, and for admins to manage the movie database, including importing from OMDB.

## Demo

[![Watch the demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

*Replace `YOUR_VIDEO_ID` with your actual YouTube video ID after uploading your demo!*

---

## Features

### User Features
- Sign up and log in with secure JWT authentication
- Browse a list of movies with search and filter options
- View detailed information for each movie, including OMDB and user ratings
- Rate movies (one rating per user per movie)
- Responsive, modern UI with card-based layouts

### Admin Features
- Add, delete, and manage movies
- Search and import movies from OMDB (individually or in bulk)
- Admin-only controls and navigation

### General
- Seamless token refresh and automatic logout on session expiration
- Error handling and user feedback for all major actions

---

## Tech Stack
- **Frontend:** Angular, TypeScript, RxJS, Angular Material (optional)
- **Backend:** Spring Boot, Java, JWT, REST API
- **Database:** MySQL
- **External API:** OMDB API

---

## Getting Started

### Prerequisites
- Node.js & npm
- Java 17+
- (Your database, if not using in-memory)

### Backend Setup
```bash
cd movierate
# Configure your DB connection in src/main/resources/application.properties
./mvnw spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
ng serve
```

The frontend will run on `http://localhost:4200` and the backend on `http://localhost:8081` and the first account will be created will be the admin by default.

---

## Folder Structure
- `movierate/` - Spring Boot backend
- `frontend/` - Angular frontend

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## Author
- Bahaa Khaled Desoky