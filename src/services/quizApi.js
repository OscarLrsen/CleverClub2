import axios from "axios";

export const fetchQuestions = (difficulty) =>
  axios.get(`/api/quiz/questions?difficulty=${difficulty}`);

export const submitAnswers = (payload) =>
  axios.post("/api/quiz/submit", payload);
