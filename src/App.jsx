import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AboutUsPage from "./pages/AboutUsPage";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Vanliga sidor med navbar */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </>
          }
        />

        {/* Admin-sida utan navbar */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* Fallback */}
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}