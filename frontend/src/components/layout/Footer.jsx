import { AtSign, Globe2 } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <img src="/logo-full.png" alt="ScoreTicket" className="footer__logo" />
          <p>Elevating the football match day experience through exclusive access and seamless digital ticketing.</p>
        </div>
        <div className="footer__column">
          <h3>Company</h3>
          <a href="#about">About Us</a><a href="#partners">Partners</a><a href="#careers">Careers</a>
        </div>
        <div className="footer__column">
          <h3>Support</h3>
          <a href="#help">Help Center</a><a href="#terms">Terms of Service</a><a href="#privacy">Privacy Policy</a>
        </div>
        <div className="footer__column">
          <h3>Follow us</h3>
          <div className="footer__socials"><a href="#social" aria-label="Website"><Globe2 size={20} /></a><a href="#contact" aria-label="Contact"><AtSign size={20} /></a></div>
        </div>
      </div>
      <div className="footer__bottom"><span>© 2026 ScoreTicket. All rights reserved.</span><div><a href="#cookies">Cookie Settings</a><a href="#accessibility">Accessibility</a></div></div>
    </footer>
  );
}

export default Footer;
