import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import registerRoute from "./routes/registerRoute.js";
import loginRoute from "./routes/loginRoute.js";
import adminRoute from "./routes/adminRoute.js";
import quizRoute from "./routes/quizRoutes.js";

import User from "./models/user.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/admin", adminRoute);
app.use("/api/quiz", quizRoute);

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend funkar!" });
});

app.post("/api/test-submit", async (req, res) => {
  try {
    const dummyAnswers = [
      { questionId: "65123456789abcdef0123456", selectedAnswer: 2 },
      { questionId: "65123456789abcdef0123457", selectedAnswer: 1 },
    ];
    const userId = "testuser";

    let score = 0;
    let correctCount = 0;

    for (const answer of dummyAnswers) {
      const question = await Question.findById(answer.questionId);
      if (!question) continue;

      if (question.correctAnswer === answer.selectedAnswer) {
        correctCount++;
        if (question.difficulty === "Lätt") score += 25;
        else if (question.difficulty === "Medel") score += 50;
        else if (question.difficulty === "Svår") score += 100;
      }
    }

    const result = new Result({ userId, score, correctCount });
    await result.save();

    res.json({ score, correctCount });
  } catch (err) {
    console.error(" Test submit error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "CleverClub",
  })
  .then(() => {
    console.log(" MongoDB connected");
    app.listen(5000, () => console.log(" Server running on port 5000"));
    createAdminUser();
  })
  .catch((err) => console.error(" MongoDB error:", err));

const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ username: "admin" });
    if (!existingAdmin) {
      const admin = new User({
        username: "admin",
        email: "admin@a.com",
        password: "admin123",
        role: "admin",
      });
      await admin.save();
      console.log(" Adminkonto skapat");
    } else {
      console.log(" Adminkonto finns redan");
    }
  } catch (err) {
    console.error(" Fel vid adminskapande:", err);
  }
};
