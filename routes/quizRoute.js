import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// 🔌 MongoDB collections
const db = mongoose.connection.db;
const questionsCol = db.collection("questions");
const attemptsCol = db.collection("attempts");

// 🧠 Poäng per svårighetsgrad
const POINTS = { Lätt: 25, Medel: 50, Svår: 100 };

// 🔄 Normalisering av svårighetssträngar
const MAP = {
  lätt: "Lätt",
  latt: "Lätt",
  easy: "Lätt",
  enkel: "Lätt",
  medel: "Medel",
  medium: "Medel",
  svår: "Svår",
  svar: "Svår",
  hard: "Svår",
};
const norm = (d) => MAP[(d || "").toLowerCase()] || d;

//
// 📥 GET /api/questions?difficulty=Lätt|Medel|Svår&limit=5
//
router.get("/questions", async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 5));
    const difficulty = norm(req.query.difficulty);
    const match = difficulty ? { difficulty } : {};

    const pipeline = [
      { $match: match },
      { $sample: { size: limit } },
      { $project: { _id: 1, text: 1, options: 1, difficulty: 1, points: 1 } },
    ];

    const docs = await questionsCol.aggregate(pipeline).toArray();
    res.json(docs);
  } catch (err) {
    console.error("GET /api/questions error:", err);
    res.status(500).json({ message: "Fel vid hämtning av frågor" });
  }
});

//
// 📤 POST /api/attempts
//
router.post("/attempts", async (req, res) => {
  try {
    const { username, quizId, difficulty, answers } = req.body;
    if (!username || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "username och answers krävs" });
    }

    const attemptDifficulty = norm(difficulty) ?? null;

    // Validera varje svar
    for (const a of answers) {
      if (!a || typeof a.questionId !== "string") {
        return res
          .status(400)
          .json({ message: "Varje answer måste ha questionId (string)" });
      }
      if (!(a.selectedIndex == null || Number.isInteger(a.selectedIndex))) {
        return res
          .status(400)
          .json({ message: "selectedIndex måste vara heltal eller null" });
      }
    }

    const qIds = answers.map((a) => a.questionId);
    const qDocs = await questionsCol.find({ _id: { $in: qIds } }).toArray();
    const qMap = new Map(qDocs.map((q) => [q._id.toString(), q]));

    let total = 0;
    const graded = answers.map((a) => {
      const q = qMap.get(a.questionId);
      const hasIndex =
        a.selectedIndex != null && Number.isInteger(a.selectedIndex);
      const correct = q
        ? hasIndex && a.selectedIndex === q.correctIndex
        : false;

      const basePts =
        q?.points ?? (q?.difficulty ? POINTS[q.difficulty] ?? 0 : 0);
      const pointsAwarded = correct ? basePts : 0;
      total += pointsAwarded;

      return {
        questionId: a.questionId,
        selectedIndex: hasIndex ? a.selectedIndex : null,
        correctIndex: q?.correctIndex ?? null,
        isCorrect: correct,
        difficulty: q?.difficulty ?? attemptDifficulty,
        pointsAwarded,
        answeredAt: new Date(),
      };
    });

    const attemptDoc = {
      username,
      quizId: quizId ?? null,
      difficulty: attemptDifficulty,
      answers: graded,
      totalScore: total,
      createdAt: new Date(),
    };

    const r = await attemptsCol.insertOne(attemptDoc);

    const breakdown = graded.map((g) => ({
      questionId: g.questionId,
      selectedIndex: g.selectedIndex,
      correctIndex: g.correctIndex,
      isCorrect: g.isCorrect,
    }));

    res
      .status(201)
      .json({ attemptId: r.insertedId, totalScore: total, breakdown });
  } catch (err) {
    console.error("POST /api/attempts error:", err);
    res.status(500).json({ message: "Fel vid rättning/sparning av resultat" });
  }
});

//
// 🏆 GET /api/leaderboard?difficulty=Lätt|Medel|Svår&limit=20
//
router.get("/leaderboard", async (req, res) => {
  try {
    const diff = norm(req.query.difficulty);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20));

    const pipeline = [
      ...(diff ? [{ $match: { difficulty: diff } }] : []),
      { $sort: { totalScore: -1, createdAt: -1 } },
      { $limit: limit },
      { $project: { username: 1, totalScore: 1, difficulty: 1, createdAt: 1 } },
    ];

    const top = await attemptsCol.aggregate(pipeline).toArray();
    res.json(top);
  } catch (err) {
    console.error("GET /api/leaderboard error:", err);
    res.status(500).json({ message: "Fel vid hämtning av leaderboard" });
  }
});

export default router;
