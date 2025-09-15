// src/lib/api.js
// Frontend-kontrakt redo för Mongo-backend
// - GET  /api/questions?difficulty=easy&limit=5&category=<id>
//     -> [{ id, text, options:[{ id, text }] }]
// - POST /api/submissions
//     -> { score, total, breakdown:[{ questionId, isCorrect, correctAnswerId, selectedAnswerId }] }

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "1";
const BASE = import.meta.env.VITE_API_URL || "";

// ======== PUBLIC API ========

/** @typedef {{ id:string, text:string }} Option */
/** @typedef {{ id:string, text:string, options:Option[] }} Question */

export async function fetchQuestions({ difficulty = "easy", limit = 5, category } = {}) {
  if (USE_MOCK) return mockFetchQuestions({ difficulty, limit });

  const origin = BASE || window.location.origin;
  const u = new URL("/api/questions", origin);
  u.searchParams.set("difficulty", difficulty);
  u.searchParams.set("limit", String(limit));
  if (category) u.searchParams.set("category", category); // <-- håll detta namn konsekvent även i backend

  const res = await fetch(u.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Kunde inte hämta frågor");

  // Förväntat format: [{ id, text, options:[{id,text}] }]
  const data = await res.json();
  return Array.isArray(data) ? data.map(normalizeQuestion) : [];
}

export async function submitQuiz({ difficulty, answers, category }) {
  // answers: [{ questionId, selectedAnswerId }]
  if (USE_MOCK) return mockSubmitQuiz({ difficulty, answers });

  const res = await fetch(`${BASE}/api/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ difficulty, category, answers }),
  });
  if (!res.ok) throw new Error("Kunde inte spara resultat");
  return res.json(); // { score, total, breakdown:[...] }
}

function normalizeQuestion(q) {
  return {
    id: String(q.id),
    text: String(q.text),
    options: (q.options || []).map((o) => ({ id: String(o.id), text: String(o.text) })),
  };
}

// ======== MOCK (kan tas bort när backend är uppe) ========

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const MOCK_BANK = {
  easy: [
    mkQ("q1", "Vilken är huvudstaden i Frankrike?", [
      ["a1", "Paris", true],
      ["a2", "Berlin"],
      ["a3", "Rom"],
      ["a4", "Madrid"],
    ]),
    mkQ("q2", "Vilket land kallas 'Landet med tusen sjöar'?", [
      ["a5", "Finland", true],
      ["a6", "Sverige"],
      ["a7", "Norge"],
    ]),
    mkQ("q3", "Vilken planet kallas den röda planeten?", [
      ["a8", "Mars", true],
      ["a9", "Venus"],
      ["a10", "Jupiter"],
    ]),
    mkQ("q4", "Hur många minuter är en timme?", [
      ["a11", "60", true],
      ["a12", "90"],
      ["a13", "120"],
    ]),
    mkQ("q5", "Vilket hav ligger öster om Sverige?", [
      ["a14", "Östersjön", true],
      ["a15", "Medelhavet"],
      ["a16", "Atlanten"],
    ]),
    // lägg gärna fler här så sampling blir roligare
  ],
  medium: [],
  hard: [],
};

function mkQ(id, text, options) {
  // options: [ [id, text, isCorrect?], ... ]
  const opts = options.map(([oid, t]) => ({ id: oid, text: t }));
  const correct = options.find((o) => o[2])?.[0] ?? null; // rätt svar-id
  return { id, text, options: opts, correctAnswerId: correct };
}

function sample(arr, n) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

async function mockFetchQuestions({ difficulty, limit }) {
  await delay(120);
  const pool = MOCK_BANK[difficulty] || [];
  const pick = sample(pool, Math.min(limit, pool.length));
  // Skicka INTE facit till klienten
  return pick.map((q) => {
    const copy = { ...q };
    delete copy.correctAnswerId;
    return copy;
  });
}

async function mockSubmitQuiz({ difficulty, answers }) {
  await delay(120);
  const pool = MOCK_BANK[difficulty] || [];
  const byQ = Object.fromEntries(pool.map((q) => [q.id, q]));

  const POINTS = 100; // 100 poäng per rätt
  let score = 0;

  const breakdown = (answers || []).map((a) => {
    const q = byQ[a.questionId];
    const correctId = q?.correctAnswerId ?? null;
    const selectedId = a.selectedAnswerId ?? null;
    const isCorrect = !!(correctId && selectedId && correctId === selectedId);
    if (isCorrect) score += POINTS;

    return {
      questionId: a.questionId,
      isCorrect,
      correctAnswerId: correctId,
      selectedAnswerId: selectedId, // <— skickas med för enkel resultatsida
    };
  });

  return { score, total: answers?.length ?? 0, breakdown };
}
