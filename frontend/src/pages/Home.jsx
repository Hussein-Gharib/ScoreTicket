import { Bolt, CalendarDays, Check, Heart, Share2, ShieldCheck, TicketCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero__glow" />
        <div className="hero__content">
          <span className="hero__badge"><span /> Official-style football ticketing</span>
          <h1>Book your seat for the <em>biggest football nights.</em></h1>
          <p>Browse upcoming matches, choose your ticket category, and manage your bookings in one modern platform.</p>
          <div className="hero__actions">
            <Link to="/matches"><Button>Explore Matches</Button></Link>
            <Link to="/register"><Button variant="outline">Create Account</Button></Link>
          </div>
          <div className="hero__trust">
            <div className="hero__avatars"><span /><span /><span /><b>+2k</b></div>
            <p>Trusted by <strong>12,000+</strong> football fans across Europe</p>
          </div>
        </div>

        <article className="featured-match glass-panel">
          <div className="featured-match__top"><span className="eyebrow">Featured match</span><div><button><Share2 size={20} /></button><button><Heart size={21} /></button></div></div>
          <div className="featured-match__teams">
            <div className="team-crests"><span><ShieldCheck size={21} /></span><span><ShieldCheck size={21} /></span></div>
            <h2>Barcelona <small>vs</small> Real Madrid</h2>
          </div>
          <p className="featured-match__meta"><TicketCheck size={16} /> Champions League • Camp Nou</p>
          <div className="featured-match__details">
            <div><span>Date</span><strong>Oct 24, 2026</strong></div>
            <div><span>Time</span><strong>21:00 CET</strong></div>
          </div>
          <div className="featured-match__price"><div><span>Starting from</span><strong>$35</strong></div><Link to="/matches"><Button>Book Now</Button></Link></div>
        </article>
      </section>

      <section className="benefits-grid">
        <article className="benefit-card"><TicketCheck /><div><h3>Verified</h3><p>100% Guaranteed Tickets</p></div></article>
        <article className="benefit-card"><Bolt /><div><h3>Instant</h3><p>Digital Mobile Delivery</p></div></article>
        <article className="benefit-card benefit-card--wide"><div><span className="eyebrow">Live support</span><h3>Concierge for VIP Travelers</h3><p>Experience hospitality beyond the whistle with our premium travel packages.</p></div><Users /></article>
      </section>
    </div>
  );
}

export default Home;
