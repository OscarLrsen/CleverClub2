import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/LeaderboardPage.css";

function LeaderboardPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchResults = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/quiz/leaderboard");
      setResults(res.data || []);
    } catch (err) {
      console.error("Kunde inte hämta resultat:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="leaderboard-wrap">
      <div className="leaderboard">
        <div className="lb-header-row">
          <h2 className="lb-heading">Topplista</h2>
          <div className="lb-actions">
            <button className="lb-btn" onClick={() => navigate("/")}>
              Hem
            </button>
            <button className="lb-btn" onClick={fetchResults}>
              Uppdatera
            </button>
          </div>
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
              {results.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      color: "#64748b",
                      padding: 18,
                    }}
                  >
                    Inga resultat ännu.
                  </td>
                </tr>
              ) : (
                results.map((r, i) => (
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
      </div>
    </div>
  );
}

export default LeaderboardPage;
