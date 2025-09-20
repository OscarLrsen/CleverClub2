import React, { useState } from "react";
import { fetchQuestions, submitAnswers } from "../services/quizApi";

function QuizPanel({ userId }) {
  const [difficulty, setDifficulty] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [started, setStarted] = useState(false);

  const handleStart = async () => {
    try {
      const res = await fetchQuestions(difficulty);
      if (res.data.length < 5) return alert("Inte tillräckligt med frågor");
      setQuestions(res.data);
      setStarted(true);
    } catch (err) {
      console.error(" Fel vid hämtning:", err);
    }
  };

  const handleAnswer = (selectedAnswer) => {
    const currentQuestion = questions[currentIndex];
    setAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion._id, selectedAnswer },
    ]);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    try {
      const res = await submitAnswers({ userId, answers });
      setScore(res.data.score);
      setCorrect(res.data.correctCount);
    } catch (err) {
      console.error(" Fel vid inskickning:", err);
      alert("Kunde inte skicka quizresultatet.");
    }
  };

  if (score !== null && correct !== null) {
    return (
      <div>
        <h2>Quiz klart!</h2>
        <p>
          Du fick {correct} av {questions.length} rätt
        </p>
        <p>Din poäng: {score}</p>
      </div>
    );
  }

  if (!started) {
    return (
      <div>
        <h2>Välj svårighetsgrad</h2>
        <button onClick={() => setDifficulty("Enkel")}>Enkel</button>
        <button onClick={() => setDifficulty("Medel")}>Medel</button>
        <button onClick={() => setDifficulty("Svår")}>Svår</button>
        {difficulty && <p>Vald: {difficulty}</p>}
        <button onClick={handleStart} disabled={!difficulty}>
          Starta Quiz
        </button>
      </div>
    );
  }

  if (currentIndex < questions.length) {
    const q = questions[currentIndex];
    return (
      <div>
        <h3>Fråga {currentIndex + 1}</h3>
        <p>{q.text}</p>
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(i)}>
            {opt}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h3>Quiz klart!</h3>
      <button onClick={handleSubmit}>Skicka Quiz</button>
    </div>
  );
}

export default QuizPanel;
