import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../../assets/Cleverclub.png";

function Navbar({ loggedInUser, onLogout }) {
  return (
    <nav className="cc-navbar">
      <div className="cc-navbar-inner">
        {/* Brand: bara logga, klickbar till startsidan */}
        <Link
          to="/"
          className="cc-brand"
          id="cc-brand"
          aria-label="Gå till startsidan"
          title="CleverClub"
        >
          <img src={logo} alt="CleverClub" className="cc-logo" />
        </Link>

        <div className="cc-links" id="cc-links">
          <Link to="/leaderboard" className="cc-link" id="nav-leaderboard">
            Topplista
          </Link>
          <Link to="/about" className="cc-link" id="nav-about">
            Om oss
          </Link>
          <Link to="/quiz" className="cc-link" id="nav-quiz">
            Quiz
          </Link>

          {loggedInUser ? (
            <>
              <span className="cc-link" id="nav-user">
                Inloggad som: {loggedInUser.username}
              </span>
              {loggedInUser.role === "admin" && (
                <Link to="/admin" className="cc-link" id="nav-admin">
                  Admin
                </Link>
              )}
              <button className="cc-link" id="nav-logout" onClick={onLogout}>
                Logga ut
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="cc-link" id="nav-login">
                Logga in
              </Link>
              <Link to="/register" className="cc-link" id="nav-register">
                Registrera
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
