import express from "express";
import User from "../models/user.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(404).json({ message: "Användare finns inte" });
  if (user.password !== password)
    return res.status(401).json({ message: "Fel lösenord" });

  res.status(200).json({
    message: "Inloggning lyckades",
    role: user.role,
  });
});

export default router;
