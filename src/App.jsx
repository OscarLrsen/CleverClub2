import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AboutUsPage from "./pages/AboutUsPage";
import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setLoggedInUser(savedUser);
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setLoggedInUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLoggedInUser(null);
  };

  return (
    <Router>
      <Navbar loggedInUser={loggedInUser} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={loggedInUser} allowedRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
