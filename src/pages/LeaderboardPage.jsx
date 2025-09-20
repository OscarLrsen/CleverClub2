import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/LeaderboardPage.css";

function LeaderboardPage() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/quiz/leaderboard"
        );
        setResults(res.data);
      } catch (err) {
        console.error(" Kunde inte hämta resultat:", err);
      }
    };

    fetchResults();
  }, []);

  return (
    <div>
      <h2> Topplista</h2>
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
          {results.map((r, i) => (
            <tr key={r._id}>
              <td>{i + 1}</td>
              <td>{r.username}</td>
              <td>{r.score}</td>
              <td>{r.correctCount}</td>
              <td>{new Date(r.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaderboardPage;
