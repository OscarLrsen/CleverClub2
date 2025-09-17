import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/Cleverclub.png";

export default function Navbar() {
  return (
    <header className="cc-navbar">
      <div className="cc-navbar-inner">
        <Link to="/" className="cc-brand">
          <img src={logo} alt="CleverClub logotyp" className="cc-logo" />
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
