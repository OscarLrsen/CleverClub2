// src/quizdashboard/lib/api.js
// Endpoints (från din server):
// GET  /api/questions?difficulty=latt|medel|svar&limit=5
// POST /api/attempts  { username, difficulty?, answers:[{ questionId, selectedIndex }] }
// GET  /api/leaderboard?difficulty=...

// Använd env om den finns, annars localhost:5000
const BASE = import.meta?.env?.VITE_API_URL || "http://localhost:5000";

// UI → backend: normalisera svårighet
const diffMap = {
  easy: "latt",
  enkel: "latt",
  lätt: "latt",
  latt: "latt",
  medium: "medel",
  medel: "medel",
  hard: "svar",
  svår: "svar",
  svar: "svar",
};
const normDifficulty = (d) =>
  d ? (diffMap[String(d).toLowerCase()] || String(d).toLowerCase()) : undefined;

/**
 * Hämtar frågor från backend (Mongo).
 * Backend-svar: [{ _id, text, options:[...], difficulty?, points? }]
 */
export async function fetchQuestions({ difficulty = "latt", limit = 5 } = {}) {
  const u = new URL("/api/questions", BASE);
  const d = normDifficulty(difficulty);
  if (d) u.searchParams.set("difficulty", d);
  u.searchParams.set("limit", String(limit));

  const res = await fetch(u.toString());
  const ctype = res.headers.get("content-type") || "";
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 120)}`);
  }
  if (!ctype.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Oväntat svar (inte JSON): ${text.slice(0, 120)}`);
  }

  const docs = await res.json();
  return Array.isArray(docs) ? docs.map(normalizeQuestionFromMongo) : [];
}

/**
 * Skicka in quiz-resultat för server-rättning + loggning (attempts).
 * answers: [{ questionId, selectedIndex }]
 * Returnerar { score, breakdown:[{questionId, selectedIndex, correctIndex, isCorrect}] }
 */
export async function submitQuiz({ username, difficulty, answers }) {
  const body = {
    username: username || "Guest",
    difficulty: normDifficulty(difficulty),
    answers,
  };

  const res = await fetch(`${BASE}/api/attempts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Kunde inte spara/räkna resultat: ${text.slice(0, 120)}`);
  }

  const data = await res.json();
  return {
    score: Number(data?.totalScore ?? data?.score ?? 0),
    breakdown: Array.isArray(data?.breakdown) ? data.breakdown : [],
  };
}

/**
 * Hämta leaderboard (valfritt).
 */
export async function getLeaderboard({ difficulty, limit = 20 } = {}) {
  const u = new URL("/api/leaderboard", BASE);
  const d = normDifficulty(difficulty);
  if (d) u.searchParams.set("difficulty", d);
  u.searchParams.set("limit", String(limit));

  const res = await fetch(u.toString());
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Kunde inte hämta leaderboard: ${text.slice(0, 120)}`);
  }
  return res.json();
}

/* -------- Helpers -------- */
function normalizeQuestionFromMongo(doc) {
  const toStr = (o) =>
    typeof o === "string" ? o : (o?.text ?? o?.label ?? o?.value ?? "");

  return {
    id: String(doc._id ?? doc.id),
    text: String(doc.text ?? ""),
    options: Array.isArray(doc.options) ? doc.options.map(toStr) : [],
    difficulty: doc.difficulty ?? null,
    // correctIndex skickas inte från /api/questions (server-rättning används).
  };
}
