// src/api/leaderboard.js

const API_BASE = "http://localhost:5000";

export async function getLeaderboard({ limit = 50 } = {}) {
  const url = `${API_BASE}/api/leaderboard?limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Leaderboard request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
