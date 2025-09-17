import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar({ loggedInUser, onLogout }) {
  return (
    <nav className="cc-navbar">
      <div className="cc-navbar-inner">
        <Link to="/" className="cc-brand" id="cc-brand">
          Cluewalk
        </Link>

        <div className="cc-links" id="cc-links">
          <Link to="/" className="cc-link" id="nav-home">
            Hem
          </Link>
          <Link to="/leaderboard" className="cc-link" id="nav-leaderboard">
            Topplista
          </Link>
          <Link to="/about" className="cc-link" id="nav-about">
            Om oss
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
