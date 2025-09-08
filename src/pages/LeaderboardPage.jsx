// src/pages/LeaderboardPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Leaderboard from "../components/Leaderboard";

export default function LeaderboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <button onClick={() => setRefreshKey(prev => prev + 1)}>
          🔄 Uppdatera
        </button>
        <button onClick={() => navigate("/")}>
          ⬅️ Tillbaka
        </button>
      </div>

      <Leaderboard key={refreshKey} />
    </div>
  );
}
