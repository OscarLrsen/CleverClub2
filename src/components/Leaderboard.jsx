import { useEffect, useState } from "react";
import { getLeaderboard } from "../api/leaderboard";
import "../styles/Leaderboard.css";
import Lottie from "lottie-react";
import coinAnim from "../assets/coin.json";
import firstP from "../assets/first.json";



function Coin() {
  return (
    <Lottie
      animationData={coinAnim} 
      loop
      autoplay
      style={{ width: 22, height: 22 }}
    />
  );
}

export default function Leaderboard({ limit = 50, refreshMs = 10000, currentUser }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getLeaderboard({ limit });
        setRows(Array.isArray(data) ? data : []);
        setErr(null);
      } catch (e) {
        console.error(e);
        setErr("Kunde inte hämta leaderboard just nu.");
      } finally {
        setLoading(false);
      }
    };
    load();
    if (refreshMs > 0) {
      const id = setInterval(load, refreshMs);
      return () => clearInterval(id);
    }
  }, [limit, refreshMs]);

  if (loading) return <p>Laddar leaderboard…</p>;
  if (err) return <p style={{ color: "red" }}>{err}</p>;

  const FirstPlaceAnim = (
  <Lottie
    animationData={firstP}
    loop
    autoplay
    style={{ width: 40, height: 40 }}
  />
);


  return (
    <div className="leaderboard-wrap">
      <div className="leaderboard">
        <div className="lb-title">Leaderboard</div>
        <div className="lb-sub">Topplista baserad på total poäng och antal spel</div>

        <div className="lb-header">
          <div>RANK</div>
          <div>ANVÄNDARE</div>
          <div style={{ textAlign: "right" }}>POÄNG</div>
          <div style={{ textAlign: "right" }}>TOTALA SPEL</div>
        </div>

        {rows.map((u, idx) => {
          const rank = idx + 1;
          const highlight = currentUser && u.username === currentUser;
          return (
            <div key={(u.username ?? "user") + "-" + idx}
                 className={`lb-row${highlight ? " highlight" : ""}`}>
              <div className="rank">
                <div className="medal">
                  {rank === 1 ? FirstPlaceAnim  : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
                </div>
                #{rank}
              </div>

              <div className="user">
                {u.username ?? "Okänd"}
              </div>

              <div className="score">
                <span className="coin" aria-hidden>
                  <Coin />   
                </span>
                {u.totalScore ?? 0}
              </div>

              <div className="attempts">{u.attempts ?? 0}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
