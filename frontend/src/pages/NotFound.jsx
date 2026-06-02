import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="empty-state">
      <div>
        <h1>404</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/">Back to home</Link>
      </div>
    </section>
  );
}

export default NotFound;