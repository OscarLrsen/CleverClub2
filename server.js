/* eslint-env node */
/* global process */
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

const {
  MONGO_URI,
  DB_NAME = "CleverClub",
  PORT = 5000,
} = process.env;

if (!MONGO_URI) {
  console.error("MONGO_URI saknas i server/.env");
  process.exit(1);
}

await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
console.log("MongoDB connected → DB:", mongoose.connection.name);

// Samlingar
const db = mongoose.connection.db;
const Questions = db.collection("questions");
const Attempts = db.collection("attempts");

// Helpers
const POINTS_BY_DIFF = { Lätt: 25, Medel: 50, Svår: 100 };
const DIFF_MAP = { lätt:"Lätt", latt:"Lätt", enkel:"Lätt", easy:"Lätt", medel:"Medel", medium:"Medel", svår:"Svår", svar:"Svår", hard:"Svår" };
const normalizeDifficulty = (d) => DIFF_MAP[(d || "").toLowerCase()] || d;
const getOptionText = (opt) => (typeof opt === "string" ? opt : (opt?.text ?? ""));
const getCorrectIndex = (q) => {
  if (!q) return null;
  if (typeof q.correctIndex === "number") return q.correctIndex;
  if (typeof q.answerIndex === "number") return q.answerIndex;
  const opts = Array.isArray(q.options) ? q.options : [];
  const ans = typeof q.correctAnswer === "string" ? q.correctAnswer : (typeof q.answer === "string" ? q.answer : null);
  if (!ans || !opts.length) return null;
  const i = opts.findIndex((o) => getOptionText(o) === ans);
  return i >= 0 ? i : null;
};
const basePoints = (q, fallbackDiff) => (typeof q?.points === "number" ? q.points : (POINTS_BY_DIFF[q?.difficulty || fallbackDiff] ?? 0));

// Health
app.get("/api/ping", (_req, res) => res.send("pong"));

// GET /api/questions (utan facit)
app.get("/api/questions", async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 5));
    const diff = normalizeDifficulty(req.query.difficulty);
    const match = diff ? { difficulty: diff } : {};
    const docs = await Questions.aggregate([
      { $match: match },
      { $sample: { size: limit } },
      { $project: { _id: 1, text: 1, options: 1, difficulty: 1, points: 1 } },
    ]).toArray();
    res.json(docs);
  } catch (e) {
    console.error("GET /api/questions error:", e);
    res.status(500).json({ message: "Serverfel vid hämtning av frågor" });
  }
});

// POST /api/attempts (rätta + logga)
app.post("/api/attempts", async (req, res) => {
  try {
    const { username = "Guest", difficulty, answers } = req.body;
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "answers krävs" });
    }

    const diff = normalizeDifficulty(difficulty) ?? null;
    const ids = answers.map((a) => String(a.questionId));
    const qs = await Questions.find({ _id: { $in: ids } })
      .project({ _id: 1, options: 1, correctIndex: 1, answerIndex: 1, correctAnswer: 1, answer: 1, difficulty: 1, points: 1 })
      .toArray();

    const byId = new Map(qs.map((q) => [String(q._id), q]));
    let total = 0;
    const graded = answers.map((a) => {
      const q = byId.get(String(a.questionId));
      const chosen = a?.selectedIndex == null ? null : Number(a.selectedIndex);
      const correctNum = (() => {
        const c = getCorrectIndex(q);
        return c == null ? null : Number(c);
      })();
      const isCorrect = chosen != null && correctNum != null && chosen === correctNum;
      const earned = isCorrect ? basePoints(q, diff) : 0;
      total += earned;
      return {
        questionId: String(a.questionId),
        selectedIndex: chosen,
        correctIndex: correctNum,
        isCorrect,
      };
    });

    await Attempts.insertOne({
      username,
      difficulty: diff,
      answers: graded,
      totalScore: total,
      createdAt: new Date(),
    });

    res.status(201).json({ totalScore: total, breakdown: graded });
  } catch (e) {
    console.error("POST /api/attempts error:", e);
    res.status(500).json({ message: "Serverfel vid rättning/sparning av resultat" });
  }
});


//Leaderboard – toppresultat per användare
//Leaderboard – totalpoäng över alla försök per användare
app.get("/api/leaderboard", async (req, res) => {
  try {
    // bestäm hur många resultat som max ska hämtas
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 50));

    // MongoDB: summera poäng och räkna rundor per användare
    const rows = await Attempts.aggregate([
      {
        $group: {
          _id: "$username",                   // gruppera på username
          totalScore: { $sum: "$totalScore" },// lägg ihop alla poäng
          attempts: { $sum: 1 },              // räkna hur många gånger spelat
          lastPlayed: { $max: "$createdAt" }, // senaste speldatum
        },
      },
      {
        $project: {
          _id: 0,            // ta bort MongoDB:s interna _id
          username: "$_id",  // byt namn till username
          totalScore: 1,
          attempts: 1,
          lastPlayed: 1,
        },
      },
      { $sort: { totalScore: -1, lastPlayed: -1 } }, // högst poäng först
      { $limit: limit }, // bara topp X
    ]).toArray();

    // skicka resultatet till frontend
    res.json(rows);
  } catch (e) {
    console.error("GET /api/leaderboard error:", e);
    res.status(500).json({ message: "Serverfel vid hämtning av leaderboard" });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
