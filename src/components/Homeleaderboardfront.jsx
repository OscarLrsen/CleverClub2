import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/LeaderboardPage.css"; // återanvänder tabell-stylen

export default function HomeLeaderboard({ limit = 4 }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/quiz/leaderboard"
        );
        setResults(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Kunde inte hämta resultat:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const visible = (Array.isArray(results) ? results : []).slice(0, limit);

  return (
    <section className="home-leaderboard">
      <div className="home-leaderboard-header">
        <h2>🌍 Topplista</h2>
        <Link to="/leaderboard" className="home-leaderboard-link">
          Visa hela listan
        </Link>
      </div>

      {loading ? (
        <p style={{ margin: 0, color: "#64748b" }}>Laddar topplistan…</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Användare</th>
              <th>Poäng</th>
              <th>Rätt</th>
              <th>Datum</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", color: "#64748b", padding: 18 }}
                >
                  Inga resultat ännu.
                </td>
              </tr>
            ) : (
              visible.map((r, i) => (
                <tr key={r._id || `${r.username}-${i}`}>
                  <td>
                    <span className="rank-badge">{i + 1}</span>
                  </td>
                  <td>{r.username}</td>
                  <td>{r.score}</td>
                  <td>{r.correctCount}</td>
                  <td>{new Date(r.date).toLocaleDateString("sv-SE")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}
