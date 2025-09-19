import express from "express";
import User from "../models/user.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: "Användare registrerad" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
