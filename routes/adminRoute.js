import User from "../models/user.js";
import express from "express";
import {
  getAllQuestions,
  deleteQuestion,
  updateQuestion,
  addQuestion,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", async (req, res) => {
  const { username } = req.query;

  const user = await User.findOne({ username });
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Åtkomst nekad" });
  }

  const users = await User.find();
  res.status(200).json(users);
});

router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Användare borttagen" });
  } catch (err) {
    res.status(500).json({ message: "Kunde inte ta bort användare" });
  }
});

router.get("/questions", getAllQuestions);
router.post("/questions", addQuestion);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);

export default router;
