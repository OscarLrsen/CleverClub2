import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useQuiz from "../hooks/useQuiz";

function QuizRun() {
  const {
    currentQuestion: q,
    total,
    index,
    selected,
    loading,
    error,
    finished,
    secondsLeft,
    canSkip,
    selectOption,
    next,
    skip,
    questions,
    result,           // ← från servern
    score,            // ← från servern
    submittedAnswers,
    goHome,
  } = useQuiz();

  const navigate = useNavigate();

  const backToDifficulty = () => {
    goHome();
    setTimeout(() => {
      navigate("/quizdashboard", { replace: true });
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
        result={result}                // ← breakdown
        score={score}                  // ← totalpoäng
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

  const optionLabel = (opt) => (typeof opt === "string" ? opt : opt?.text ?? "");
  const danger = secondsLeft <= 3;
  const classForOption = (_opt, i) => (selected === i ? "selected" : "");

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
        <div className="progress-bar" style={{ width: `${progressPct}%` }} />
      </div>

      <h2 className="quiz-title">{q?.text ?? ""}</h2>

      <div className="quiz-options">
        {(q?.options || []).map((opt, i) => {
          const label = optionLabel(opt);
          const cls = classForOption(opt, i);
          return (
            <button
              key={`opt-${i}`}
              type="button"
              className={`option ${cls}`}
              onClick={() => selectOption(i)}
            >
              <span className="dot" aria-hidden="true" />
              <span className="opt-label">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="quiz-actions">
        <button className="btn light" type="button" onClick={skip} disabled={!canSkip}>
          Hoppa över
        </button>
        <button className="btn primary" type="button" onClick={next} disabled={selected == null}>
          Nästa
        </button>
      </div>
    </div>
  );
}

/* Resultatsida — använder breakdown från servern (/api/attempts) */
function ResultsView({ questions, result, score, submittedAnswers, onBackToDifficulty }) {
  // Map: questionId -> breakdown-rad
  const byQ = useMemo(
    () =>
      Object.fromEntries(
        (Array.isArray(result) ? result : []).map((r) => [r.questionId, r])
      ),
    [result]
  );

  const optionTextByIndex = (q, idx) => {
    if (idx == null || idx < 0) return "Not answered";
    const arr = q?.options || [];
    const val = arr[idx];
    return typeof val === "string" ? val : val?.text ?? "Not answered";
  };

  const correctCount = useMemo(() => {
    if (Array.isArray(result) && result.length > 0) {
      return result.reduce((acc, r) => acc + (r.isCorrect ? 1 : 0), 0);
    }
    return 0;
  }, [result]);

  return (
    <div className="quiz-wrap">
      <h2 className="quiz-title">Klart!</h2>
      <p className="quiz-score" style={{ marginTop: 6 }}>
        Du hade <strong>{correctCount}</strong> av{" "}
        <strong>{questions.length}</strong> rätt
      </p>
      <p className="quiz-score">Poäng: {score}</p>

      <div
        className="results-list"
        style={{ display: "grid", gap: 12, maxWidth: 900, margin: "18px auto" }}
      >
        {questions.map((q) => {
          const b = byQ[q.id] || {};
          const selectedIndex =
            typeof b.selectedIndex === "number"
              ? b.selectedIndex
              : submittedAnswers?.[q.id] ?? null;
          const correctIndex =
            typeof b.correctIndex === "number" ? b.correctIndex : null;

          const isCorrect =
            typeof b.isCorrect === "boolean"
              ? b.isCorrect
              : selectedIndex != null &&
                correctIndex != null &&
                selectedIndex === correctIndex;

          const userText = optionTextByIndex(q, selectedIndex);
          const correctText = optionTextByIndex(q, correctIndex);

          return (
            <div
              key={q.id}
              className={`result-item ${isCorrect ? "correct" : "incorrect"}`}
              style={{ padding: 12, borderRadius: 12, border: "1px solid var(--border)" }}
            >
              <div className="question" style={{ fontWeight: 700, marginBottom: 6 }}>
                {q.text}
              </div>
              <div className="user-answer">Ditt svar: {userText}</div>
              <div className="correct-answer">Rätt svar: {correctText}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
        <button className="btn light" type="button" onClick={onBackToDifficulty}>
          Tillbaka till svårighetsväljaren
        </button>
      </div>
    </div>
  );
}

export default QuizRun;
