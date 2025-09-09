import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="cc-navbar">
      <div className="cc-navbar-inner">
        <Link to="/" className="cc-brand">
          CleverClub
        </Link>

        <nav className="cc-links">
          <Link to="/about" className="cc-link">
            Om oss
          </Link>
          <Link to="/login" className="cc-link">
            Logga in
          </Link>
          <Link to="/register" className="cc-link">
            Registrera
          </Link>
        </nav>
      </div>
    </header>
  );
}
