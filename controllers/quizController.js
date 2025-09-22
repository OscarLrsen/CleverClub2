import Question from "../models/Question.js";
import Result from "../models/Result.js";

export const getQuestions = async (req, res) => {
  try {
    const { difficulty } = req.query;
    const questions = await Question.aggregate([
      { $match: { difficulty } },
      { $sample: { size: 5 } },
    ]);
    res.json(
      questions.map((q) => ({
        _id: q._id,
        text: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const submitResult = async (req, res) => {
  try {
    const { username, answers } = req.body;

    if (!username || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Ogiltig data" });
    }

    let score = 0;
    let correctCount = 0;

    for (const answer of answers) {
      const question = await Question.findOne({ _id: answer.questionId });
      if (!question) {
        console.log(" Fråga hittades inte:", answer.questionId);
        continue;
      }

      if (question.correctIndex === answer.selectedAnswer) {
        correctCount++;
        score += question.points || 0;
      }
    }

    const result = new Result({
      username,
      score,
      correctCount,
    });
    await result.save();
    res.status(200).json({ score, correctCount });
  } catch (err) {
    console.error(" Fel i submitResult:", err.message);
    res.status(500).json({ error: "Serverfel vid inskickning" });
  }
};
