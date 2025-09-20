import React, { useState } from "react";
import axios from "axios";

function QuizPage({ loggedInUser }) {
  const [difficulty, setDifficulty] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [correctCount, setCorrectCount] = useState(null);
  const [started, setStarted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const username = loggedInUser?.username;

  const startQuiz = async () => {
    try {
      const res = await axios.get(
        `/api/quiz/questions?difficulty=${difficulty}`
      );
      if (res.data.length < 5) {
        alert("Inte tillräckligt med frågor för denna svårighetsgrad.");
        return;
      }
      setQuestions(res.data);
      setStarted(true);
    } catch (err) {
      console.error("Fel vid hämtning:", err);
    }
  };

  const handleNext = () => {
    const currentQuestion = questions[currentIndex];
    setAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion._id, selectedAnswer: selectedOption },
    ]);
    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
  };

  const submitQuiz = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/quiz/submit", {
        username,
        answers,
      });

      setScore(res.data.score);
      setCorrectCount(res.data.correctCount);
      if (!username) {
        alert("Ingen användare inloggad – kan inte skicka quiz.");
        return;
      }
    } catch (err) {
      console.error("Fel vid inskickning:", err);
      alert("Kunde inte skicka quizresultatet.");
    }
  };

  const resetQuiz = () => {
    setScore(null);
    setCorrectCount(null);
    setQuestions([]);
    setAnswers([]);
    setCurrentIndex(0);
    setStarted(false);
    setSelectedOption(null);
    setDifficulty("");
  };

  const difficultyLabel = {
    easy: "Enkel",
    medium: "Medel",
    hard: "Svår",
  };

  return (
    <div className="quiz-container">
      {score !== null && correctCount !== null && (
        <div className="quiz-result">
          <h2> Quiz klart!</h2>
          <p>
            Du fick <strong>{correctCount}</strong> av{" "}
            <strong>{questions.length}</strong> rätt
          </p>
          <p>
            Din poäng: <strong>{score}</strong>
          </p>
          <button onClick={resetQuiz}> Kör igen</button>
        </div>
      )}

      {!started && score === null && (
        <div className="quiz-start">
          <h2>Välj svårighetsgrad</h2>
          <div className="difficulty-buttons">
            <button onClick={() => setDifficulty("easy")}> Enkel</button>
            <button onClick={() => setDifficulty("medium")}> Medel</button>
            <button onClick={() => setDifficulty("hard")}> Svår</button>
          </div>
          {difficulty && (
            <p>
              Vald: <strong>{difficultyLabel[difficulty]}</strong>
            </p>
          )}
          <button onClick={startQuiz} disabled={!difficulty}>
            Starta Quiz
          </button>
        </div>
      )}

      {started && currentIndex < questions.length && (
        <div className="quiz-question">
          <h3>Fråga {currentIndex + 1}</h3>
          <p>{questions[currentIndex].text}</p>
          <div className="answer-options">
            {questions[currentIndex].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelectedOption(i)}
                className={selectedOption === i ? "selected" : ""}
              >
                {opt}
              </button>
            ))}
          </div>
          <button onClick={handleNext} disabled={selectedOption === null}>
            Nästa
          </button>
        </div>
      )}

      {started && currentIndex === questions.length && score === null && (
        <div className="quiz-submit">
          <h3>Quiz klart!</h3>
          <button onClick={submitQuiz}>Skicka Quiz</button>
        </div>
      )}
    </div>
  );
}

export default QuizPage;
