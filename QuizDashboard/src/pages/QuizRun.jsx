// src/pages/QuizRun.jsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useQuiz from "../hooks/useQuiz";

export default function QuizRun() {
  const {
    currentQuestion: q,
    total,
    index,
    selected,
    loading,
    error,
    finished,
    score,
    secondsLeft,
    canSkip,
    selectOption,
    next,
    skip,
    questions,
    result,
    submittedAnswers,
    goHome, // <-- från provider
  } = useQuiz();

  const navigate = useNavigate();

  // Robust back-handler: nolla state + navigera hem (/)
  const backToDifficulty = () => {
    goHome(); // nolla allt quiz-state
    // liten micro-delay låter react-router byta vy stabilt
    setTimeout(() => {
      navigate("/", { replace: true });
      window.scrollTo(0, 0);
    }, 0);
  };

  const progressPct = useMemo(() => {
    if (!total) return 0;
    return Math.min(100, ((index + 1) / total) * 100);
  }, [index, total]);

  if (loading) {
    return (
      <div className="quiz-wrap">
        <div className="quiz-top">Laddar frågor…</div>
        <div className="progress">
          <div className="progress-bar" style={{ width: "25%" }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-wrap">
        <p style={{ color: "crimson" }}>{String(error)}</p>
      </div>
    );
  }

  if (finished) {
    return (
      <ResultsView
        questions={questions}
        result={result}
        score={score}
        submittedAnswers={submittedAnswers}
        onBackToDifficulty={backToDifficulty}
      />
    );
  }

  if (!q) {
    return (
      <div className="quiz-wrap">
        <p>Inga frågor tillgängliga ännu.</p>
      </div>
    );
  }

  const optionLabel = (opt) =>
    typeof opt === "string" ? opt : opt?.text ?? "";
  const optionKey = (opt, i) =>
    typeof opt === "string" ? `s-${i}` : opt?.id ?? `o-${i}`;
  const danger = secondsLeft <= 3;

  // Visuell highlight direkt om man vill (i dev när correctAnswerId finns)
  const classForOption = (opt, i) => {
    const id = typeof opt === "string" ? null : opt?.id;
    if (selected == null) return "";
    if (!q.correctAnswerId) return selected === i ? "selected" : "";
    if (id === q.correctAnswerId) return "correct";
    if (selected === i && id !== q.correctAnswerId) return "incorrect";
    return "";
  };

  return (
    <div className="quiz-wrap">
      <div
        className="quiz-top"
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="quiz-step">
          Fråga {index + 1} / {total}
        </div>
        <div className={`timer ${danger ? "danger" : ""}`} aria-live="polite">
          Time Left: {String(Math.max(secondsLeft, 0)).padStart(2, "0")} seconds
        </div>
      </div>

      <div className="progress">
        <div
          className="progress-bar"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <h2 className="quiz-title">{q?.text ?? ""}</h2>

      <div className="quiz-options">
        {(q?.options || []).map((opt, i) => {
          const label = optionLabel(opt);
          const cls = classForOption(opt, i);
          return (
            <button
              key={optionKey(opt, i)}
              type="button"
              className={`option ${cls}`}
              onClick={() => selectOption(i)}
            >
              <span className="dot" aria-hidden="true" />
              <span className="label">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="quiz-actions">
        <button
          className="btn light"
          type="button"
          onClick={skip}
          disabled={!canSkip}
        >
          Hoppa över
        </button>
        <button
          className="btn primary"
          type="button"
          onClick={next}
          disabled={selected == null}
        >
          Nästa
        </button>
      </div>
    </div>
  );
}

/*  Resultatsida  */
function ResultsView({
  questions,
  result,
  score,
  submittedAnswers,
  onBackToDifficulty,
}) {
  // Snabb lookup: questionId breakdown
  const byQ = useMemo(
    () => Object.fromEntries((result || []).map((r) => [r.questionId, r])),
    [result]
  );

  const optionText = (q, idOrNull) => {
    if (!idOrNull) return "Not answered";
    const opt = (q?.options || []).find((o) =>
      typeof o === "string" ? false : o.id === idOrNull
    );
    return opt ? (typeof opt === "string" ? opt : opt.text) : "Not answered";
  };

  return (
    <div className="quiz-wrap">
      <h2 className="quiz-title">Klart! 🎉</h2>
      <p className="quiz-score">Poäng: {score}</p>

      <div
        className="results-list"
        style={{ display: "grid", gap: 12, maxWidth: 900, margin: "18px auto" }}
      >
        {questions.map((q) => {
          const b = byQ[q.id] || {};
          const selectedId = b.selectedAnswerId ?? submittedAnswers?.[q.id] ?? null;
          const correctId = b.correctAnswerId ?? q.correctAnswerId ?? null;

          const isCorrect =
            typeof b.isCorrect === "boolean"
              ? b.isCorrect
              : selectedId && correctId
              ? selectedId === correctId
              : false;

          const userText = optionText(q, selectedId);
          const correctText = optionText(q, correctId);

          return (
            <div
              key={q.id}
              className={`result-item ${isCorrect ? "correct" : "incorrect"}`}
              style={{
                padding: 12,
                borderRadius: 12,
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="question"
                style={{ fontWeight: 700, marginBottom: 6 }}
              >
                {q.text}
              </div>
              <div className="user-answer">Ditt svar: {userText}</div>
              <div className="correct-answer">Rätt svar: {correctText}</div>
            </div>
          );
        })}
      </div>

      {/* Knapp för att gå tillbaka till svårighetsväljaren */}
      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "center",
          marginTop: 16,
        }}
      >
        <button className="btn light" type="button" onClick={onBackToDifficulty}>
          Tillbaka till svårighetsväljaren
        </button>
      </div>
    </div>
  );
}
