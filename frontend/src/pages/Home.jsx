import { Link } from "react-router-dom";
import Button from "../components/common/Button";

function Home() {
  return (
    <section className="hero">
      <div className="hero__content">
        <span className="hero__badge">Official-style football ticketing</span>

        <h1>Book your seat for the biggest football nights.</h1>

        <p>
          Browse upcoming matches, choose your ticket category, and manage your
          bookings in one modern platform.
        </p>

        <div className="hero__actions">
          <Link to="/matches">
            <Button>Explore Matches</Button>
          </Link>

          <Link to="/register">
            <Button variant="outline">Create Account</Button>
          </Link>
        </div>
      </div>

      <div className="hero__card">
        <p className="hero__card-label">Featured Match</p>
        <h2>Barcelona vs Real Madrid</h2>
        <p>Champions League · Camp Nou</p>
        <div className="hero__price">From $35</div>
      </div>
    </section>
  );
}

export default Home;