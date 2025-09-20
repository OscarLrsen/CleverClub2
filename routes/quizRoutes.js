import Result from "../models/Result.js";
import express from "express";
import { getQuestions, submitResult } from "../controllers/quizController.js";

const router = express.Router();

router.get("/questions", getQuestions);
router.post("/submit", submitResult);

router.get("/leaderboard", async (req, res) => {
  try {
    const results = await Result.find()
      .sort({ score: -1, correctCount: -1 })
      .limit(50);

    res.status(200).json(results);
  } catch (err) {
    console.error(" Fel vid hämtning av leaderboard:", err);
    res.status(500).json({ message: "Kunde inte hämta resultat" });
  }
});

export default router;
