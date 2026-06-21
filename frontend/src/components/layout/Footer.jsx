import { Code2, Globe2, Mail } from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>SCORETICKET</strong>
        <p>Professional football ticketing, built for match day.</p>
      </div>
      <div className="footer__links">
        <a href="#privacy">Privacy</a>
        <a href="#terms">Terms</a>
        <a href="#support">Support</a>
      </div>
      <div className="footer__socials">
        <a href="#website" aria-label="Website"><Globe2 size={18} /></a>
        <a href="#email" aria-label="Email"><Mail size={18} /></a>
        <a href="#github" aria-label="GitHub"><Code2 size={18} /></a>
      </div>
    </footer>
  );
}

export default Footer;
