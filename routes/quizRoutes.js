// routes/quizRoutes.js
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Frontend skickar latt|medel|svar → i din DB heter det "Lätt"|"Medel"|"Svår"
const diffMap = { latt: "Lätt", medel: "Medel", svar: "Svår" };
const toDisplay = (d) => (d ? diffMap[String(d).toLowerCase()] : undefined);

router.get("/questions", async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 5));
    const d = toDisplay(req.query.difficulty);           // "Lätt" | "Medel" | "Svår" | undefined
    const match = d ? { difficulty: d } : {};            // filtrera på svårighet om satt

    // Hämta från collection "questions" (ingen Mongoose-model behövs)
    const col = mongoose.connection.collection("questions");

    const pipeline = [
      { $match: match },
      { $sample: { size: limit } },                      // slumpa 'limit' st
      { $project: { text: 1, options: 1 } },             // skicka INTE correctIndex
    ];

    const docs = await col.aggregate(pipeline).toArray();

    // Normalisera för frontend
    const out = docs.map((doc) => ({
      id: String(doc._id),
      text: String(doc.text ?? ""),
      options: Array.isArray(doc.options) ? doc.options.map(String) : [],
    }));

    res.json(out);
  } catch (err) {
    console.error("GET /api/questions error:", err);
    res.status(500).json({ message: "Serverfel vid hämtning av frågor" });
  }
});

export default router;
