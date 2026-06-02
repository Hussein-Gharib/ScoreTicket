# ScoreTicket

ScoreTicket is a full-stack football ticket booking platform where users can browse football matches, view ticket categories, book tickets, and manage their purchased tickets.

The project also includes an admin panel for managing teams, stadiums, matches, and ticket categories.

## Features

### User Features
- Register a new account
- Login with JWT authentication
- Browse upcoming football matches
- View ticket categories for each match
- Choose ticket quantity
- Book tickets
- View booked tickets
- Logout

### Admin Features
- Admin protected dashboard
- Add football teams
- Add stadiums
- Add matches
- Add ticket categories
- Admin-only backend routes

## Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Axios
- CSS

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcryptjs
- dotenv
- cors

### Database
- PostgreSQL
- pgAdmin

## Project Structure

```txt
ScoreTicket/
  backend/
    src/
      config/
      controllers/
      middleware/
      routes/
      server.js

  frontend/
    public/
    src/
      api/
      components/
      layouts/
      pages/
      styles/

  package.json
  README.md