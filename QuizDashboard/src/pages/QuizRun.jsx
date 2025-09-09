import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useQuiz from "../hooks/useQuiz";

function ProgressBar({ value, max }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="progress">
      <div className="progress-bar" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function QuizRun() {
  const {
    difficulty,
    questions,
    index,
    selected,
    score,
    finished,
    startQuiz,
    selectOption,
    skip,
    next,
  } = useQuiz();
  const navigate = useNavigate();

  useEffect(() => {
    if (!questions?.length) startQuiz(difficulty || "easy");
  }, [questions, startQuiz, difficulty]);

  if (!questions?.length) {
    return (
      <div className="container quiz-wrap">
        <p>Laddar frågor…</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="container quiz-wrap" style={{ textAlign: "center" }}>
        <h2>Klart! 🎉</h2>
        <p style={{ color: "#6b7280" }}>Din poäng: {score}</p>
        <button className="btn" onClick={() => navigate("/")}>Tillbaka</button>
      </div>
    );
  }

  const q = questions[index];
  const step = index + 1;
  const total = questions.length;

  return (
    <div className="container quiz-wrap">
      <div className="quiz-top">
        <div className="quiz-step">Fråga {step} av {total}</div>
        <ProgressBar value={step} max={total} />
      </div>

      <h2 className="quiz-title">{q.q}</h2>

      <div className="quiz-options">
        {q.options.map((text, i) => (
          <label key={i} className={`option ${selected === i ? "selected" : ""}`}>
            <input
              type="radio"
              name={`q-${index}`}
              checked={selected === i}
              onChange={() => selectOption(i)}
            />
            <span className="dot" />
            <span className="label">{text}</span>
          </label>
        ))}
      </div>

      <div className="quiz-actions">
        <button className="btn light" onClick={skip}>Hoppa över</button>
        <button className="btn primary" disabled={selected == null} onClick={next}>Nästa</button>
      </div>

      <div className="quiz-score">Poäng: {score}</div>
    </div>
  );
}
