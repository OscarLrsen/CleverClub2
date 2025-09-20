import Question from "../models/Question.js";

export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: "Kunde inte hämta frågor" });
  }
};

export const addQuestion = async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    await newQuestion.save();
    res.status(201).json({ message: "Fråga skapad" });
  } catch (err) {
    res.status(500).json({ message: "Kunde inte skapa fråga" });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    await Question.updateOne({ _id: req.params.id }, req.body);
    res.status(200).json({ message: "Fråga uppdaterad" });
  } catch (err) {
    res.status(500).json({ message: "Kunde inte uppdatera fråga" });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    await Question.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Fråga borttagen" });
  } catch (err) {
    res.status(500).json({ message: "Kunde inte ta bort fråga" });
  }
};
