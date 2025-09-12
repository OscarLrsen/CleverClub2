// src/pages/LeaderboardPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Leaderboard from "../components/Leaderboard";

export default function LeaderboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        paddingTop: "60px",
      }}
    >
      {/* Rubrik */}
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#1976d2",
          textAlign: "center",
        }}
      >
        🌍 Leaderboard
      </h1>

      {/* Knappar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <button
          style={{
            padding: "10px 20px",
            borderRadius: 6,
            border: "none",
            backgroundColor: "#1976d2",
            color: "white",
            cursor: "pointer",
            fontSize: "1rem",
          }}
          onClick={() => setRefreshKey((prev) => prev + 1)}
        >
          🔄 Uppdatera
        </button>

        <button
          style={{
            padding: "10px 20px",
            borderRadius: 6,
            border: "none",
            backgroundColor: "#1976d2",
            color: "white",
            cursor: "pointer",
            fontSize: "1rem",
          }}
          onClick={() => navigate("/")}
        >
          ⬅️ Tillbaka
        </button>
      </div>

      {/* Leaderboard-tabellen */}
      <div style={{ width: "100%", maxWidth: 900 }}>
        <Leaderboard key={refreshKey} />
      </div>
    </div>
  );
}
