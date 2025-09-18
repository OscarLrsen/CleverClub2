// routes/quizRoutes.js
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const diffMap = { latt: "Lätt", medel: "Medel", svar: "Svår" };
const toDisplay = (d) => (d ? diffMap[String(d).toLowerCase()] : undefined);

router.get("/questions", async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 5));
    const d = toDisplay(req.query.difficulty);      
    const match = d ? { difficulty: d } : {};          


    const col = mongoose.connection.collection("questions");

    const pipeline = [
      { $match: match },
      { $sample: { size: limit } },                     
      { $project: { text: 1, options: 1 } },            
    ];

    const docs = await col.aggregate(pipeline).toArray();

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
