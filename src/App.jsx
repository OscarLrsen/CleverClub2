import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AboutUsPage from "./pages/AboutUsPage";
import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";

import QuizDashboardLayout from "./quizdashboard/DashboardLayout";
import Hero from "./quizdashboard/components/Hero";
import DifficultySelect from "./quizdashboard/components/DifficultySelect";
import QuizRun from "./quizdashboard/pages/QuizRun";

function DashboardHome() {
  return (
    <div className="container">
      <Hero />
      <DifficultySelect />
    </div>
  );
}

function AppInner() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const location = useLocation();

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

  const onQuizDashboard = location.pathname.startsWith("/quizdashboard");

  return (
    <>
      {!onQuizDashboard && (
        <Navbar loggedInUser={loggedInUser} onLogout={handleLogout} />
      )}

      <Routes>
        {/* Main routes */}
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

        {/* Dashboard – NÄSTLA DIREKT HÄR (ingen extra <Routes> i en child-komponent) */}
        <Route path="/quizdashboard" element={<QuizDashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="quiz" element={<QuizRun />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}
