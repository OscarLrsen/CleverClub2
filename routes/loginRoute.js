import express from "express";
import User from "../models/user.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Fel användarnamn eller lösenord" });
  }

  res.status(200).json({
    message: "Inloggning lyckades",
    role: user.role,
    userId: user._id,
  });
});

export default router;
