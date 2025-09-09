import { useState } from "react";
import useQuiz from "../hooks/useQuiz"; // 👈 ändrat

function Logo() {
  // Enkel inline-SVG (slipper bildfil)
  return (
    <div className="logo">
      <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" fill="currentColor" />
      </svg>
      <span className="brand">CleverClub</span>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { difficulty } = useQuiz(); // visar vald svårighet som chip

  return (
    <header className="navbar">
      <Logo />

      <button
        className="nav-toggle"
        aria-label="Öppna meny"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        ☰
      </button>

      <nav className={`nav-links ${open ? "open" : ""}`}>
        {/* Byt till NavLink senare när router kommer */}
        <a href="#" className="nav-link" aria-current="page">Hem</a>
        <a href="#" className="nav-link">Leaderboard</a>
      </nav>

      <div className="nav-right">
        {difficulty && <span className="chip">Svårighet: {labelOf(difficulty)}</span>}

        <div className="user">
          <div className="avatar" title="Inloggad som Oscar">O</div>
          <button className="ghost-btn">Logga ut</button>
        </div>
      </div>
    </header>
  );
}

function labelOf(key) {
  if (key === "easy") return "Lätt";
  if (key === "medium") return "Medel";
  if (key === "hard") return "Svår";
  return key;
}
