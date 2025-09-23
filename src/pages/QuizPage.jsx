import React, { useState } from "react";
import axios from "axios";
import "../styles/Quizpanel.css";

import heroImg from "../../assets/hero.jpg";
import easyImg from "../../assets/easy.jpg";
import mediumImg from "../../assets/medium.jpg";
import hardImg from "../../assets/hard.jpg";

function Hero() {
  return (
    <div className="hero">
      <img src={heroImg} alt="Världskarta" />
    </div>
  );
}

function DifficultyCard({ title, subtitle, img, selected, onSelect }) {
  return (
    <div className={`diff-card ${selected ? "selected" : ""}`}>
      <div className="diff-text">
        <h3>{title}</h3>
        <p>{subtitle}</p>
        <button type="button" className="btn-light" onClick={onSelect}>
          Välj
        </button>
      </div>
      <div className="diff-media">
        <img src={img} alt={title} />
      </div>
    </div>
  );
}

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

  const difficultyLabel = { easy: "Lätt", medium: "Medel", hard: "Svår" };

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

  return (
    <div className="quizdash">
      <div className="container">
        {/* resultat */}
        {score !== null && correctCount !== null && (
          <div className="quiz-result">
            <h2>Quiz klart!</h2>
            <p>
              Du fick <strong>{correctCount}</strong> av{" "}
              <strong>{questions.length}</strong> rätt
            </p>
            <p>
              Din poäng: <strong>{score}</strong>
            </p>

            <h3>Dina svar:</h3>
            <ul className="quiz-review-list">
              {questions.map((q) => {
                const userAnswer = answers.find(
                  (a) => a.questionId === q._id
                )?.selectedAnswer;
                const isAnswered =
                  userAnswer !== undefined && userAnswer !== null;
                const isCorrect = isAnswered && userAnswer === q.correctIndex;

                return (
                  <li
                    key={q._id}
                    className={`quiz-review-item ${
                      !isAnswered
                        ? "skipped"
                        : isCorrect
                        ? "correct"
                        : "incorrect"
                    }`}
                  >
                    <span className="quiz-review-question">{q.text}</span>
                    <span
                      className={`quiz-review-status ${
                        !isAnswered
                          ? "skipped"
                          : isCorrect
                          ? "correct"
                          : "incorrect"
                      }`}
                    >
                      {!isAnswered ? "Ej besvarad" : isCorrect ? "✅" : "❌"}
                    </span>
                  </li>
                );
              })}
            </ul>

            <button className="btn primary" onClick={resetQuiz}>
              Kör igen
            </button>
          </div>
        )}

        {/* start */}
        {!started && score === null && (
          <>
            <Hero />
            <section className="select-wrap">
              <h2>Välj Svårighetsgrad</h2>
              <p className="lead">
                Välj en svårighetsgrad som passar dina kunskaper och
                färdigheter. Ju högre svårighetsgrad, desto mer utmanande blir
                frågorna.
              </p>

              <div className="diff-list">
                <DifficultyCard
                  title="Lätt"
                  subtitle="Perfekt för nybörjare"
                  img={easyImg}
                  selected={difficulty === "easy"}
                  onSelect={() => setDifficulty("easy")}
                />
                <DifficultyCard
                  title="Medel"
                  subtitle="Utmanande för de flesta"
                  img={mediumImg}
                  selected={difficulty === "medium"}
                  onSelect={() => setDifficulty("medium")}
                />
                <DifficultyCard
                  title="Svår"
                  subtitle="Endast för experter"
                  img={hardImg}
                  selected={difficulty === "hard"}
                  onSelect={() => setDifficulty("hard")}
                />
              </div>

              {difficulty && (
                <p style={{ textAlign: "center", color: "var(--muted)" }}>
                  Vald: <strong>{difficultyLabel[difficulty]}</strong>
                </p>
              )}

              <div className="start-row">
                <button
                  className="btn primary start-btn"
                  onClick={startQuiz}
                  disabled={!difficulty}
                >
                  Starta Quiz
                </button>
              </div>
            </section>
          </>
        )}

        {/* frågorna */}
        {started && currentIndex < questions.length && (
          <div className="quiz-run">
            <div className="quiz-meta">
              <div className="quiz-step">
                Fråga {currentIndex + 1} av {questions.length}
              </div>
              <div
                className="progress"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(
                  ((currentIndex + 1) / questions.length) * 100
                )}
              >
                <div
                  className="progress-bar"
                  style={{
                    width: `${Math.round(
                      ((currentIndex + 1) / questions.length) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <h2 className="q-title">{questions[currentIndex].text}</h2>

            <div className="quiz-options answer-options">
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

            <div className="quiz-actions">
              <button
                className="btn primary"
                onClick={handleNext}
                disabled={selectedOption === null}
              >
                Nästa
              </button>
            </div>
          </div>
        )}

        {/* submit knapp */}
        {started && currentIndex === questions.length && score === null && (
          <div className="quiz-submit">
            <h3>Quiz klart!</h3>
            <button className="btn primary" onClick={submitQuiz}>
              Skicka Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizPage;
