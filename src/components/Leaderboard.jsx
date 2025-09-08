// src/components/Leaderboard.jsx
import { useEffect, useState } from "react";
import { getLeaderboard } from "../api/leaderboard";

export default function Leaderboard({ limit = 50, refreshMs = 10000 }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  async function load() {
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
  }

  useEffect(() => {
    load();
    const id = setInterval(load, refreshMs);
    return () => clearInterval(id);
  }, [limit, refreshMs]);

  if (loading) return <p>Laddar leaderboard…</p>;
  if (err) return <p style={{ color: "red" }}>{err}</p>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h2>Leaderboard (R/F)</h2>
      <table width="100%" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <Th>#</Th>
            <Th>Användare</Th>
            <Th>R</Th>
            <Th>F</Th>
            <Th>R/F</Th>
            <Th>Accuracy</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u, i) => (
            <tr key={u.userId} style={{ borderTop: "1px solid #eee" }}>
              <Td>{i + 1}</Td>
              <Td>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img
                    src={u.avatarUrl || "/default.png"}
                    width="24"
                    height="24"
                    alt=""
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                  {u.username}
                </div>
              </Td>
              <Td center>{u.totalCorrect}</Td>
              <Td center>{u.totalIncorrect}</Td>
              <Td center>{formatRF(u.kd, u.totalCorrect, u.totalIncorrect)}</Td>
              <Td center>
                {u.accuracy != null
                  ? (u.accuracy * 100).toFixed(1) + "%"
                  : "—"}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatRF(kd, r, f) {
  if (f === 0 && r > 0) return r.toFixed(2);
  return (kd ?? 0).toFixed(2);
}

function Th({ children }) {
  return (
    <th
      style={{
        textAlign: "left",
        fontWeight: 600,
        padding: "8px 6px",
        fontSize: 14,
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, center }) {
  return (
    <td
      style={{
        padding: "10px 6px",
        textAlign: center ? "center" : "left",
        fontSize: 14,
      }}
    >
      {children}
    </td>
  );
}
