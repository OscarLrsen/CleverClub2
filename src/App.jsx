// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AboutUsPage from "./pages/AboutUsPage";

export default function App() {
  return (
    <Router>
      <nav style={{display:"flex",gap:12,padding:12,borderBottom:"1px solid #eee"}}>
        <Link to="/">Hem</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/login">Logga in</Link>
        <Link to="/register">Registrera</Link>
      </nav>

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/about" element={<AboutUsPage />} />
      </Routes>
    </Router>
  );
}
