import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QuizContext from "./QuizContext";
import { fetchQuestions, submitQuiz } from "../lib/api";

export default function QuizProvider({ children }) {
  // STATE
  const [difficulty, setDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [order, setOrder] = useState([]);
  const [orderPos, setOrderPos] = useState(0);

  const [selected, setSelected] = useState(null); // valt options-index
  const [answers, setAnswers] = useState({});     // { questionIndex: { questionId, selectedIndex } }

  const [score, setScore] = useState(0);
  const [result, setResult] = useState([]);
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Timer
  const [secondsLeft, setSecondsLeft] = useState(10);
  const timerRef = useRef(null);
  const onTimeoutRef = useRef(() => {});

  // DERIVED
  const total = questions.length;
  const currentQuestionIndex = order[orderPos] ?? 0;
  const currentQuestion = questions[currentQuestionIndex] || null;

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const remainingUnanswered = Math.max(0, total - answeredCount);
  const canSkip = remainingUnanswered > 1 && !finished;

  // TIMER
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetTimer = useCallback((start = 10) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsLeft(start);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 0) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          onTimeoutRef.current?.();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, []);

  // START
  const startQuiz = useCallback(
    async (diff) => {
      const d = diff || difficulty || "easy";
      setDifficulty(d);
      setLoading(true);
      setError(null);
      stopTimer();

      try {
        const qs = await fetchQuestions({ difficulty: d, limit: 5 });
        setQuestions(qs || []);
        setOrder(Array.from({ length: qs?.length || 0 }, (_, i) => i));
        setOrderPos(0);

        setSelected(null);
        setAnswers({});
        setScore(0);
        setResult([]);
        setSubmittedAnswers({});
        setFinished(false);

        if ((qs?.length || 0) > 0) resetTimer(10);
      } catch (e) {
        console.error(e);
        setError(e?.message || "Kunde inte hämta frågor");
      } finally {
        setLoading(false);
      }
    },
    [difficulty, resetTimer, stopTimer]
  );

  useEffect(() => stopTimer, [stopTimer]);

  useEffect(() => {
    if (difficulty && total === 0 && !loading) {
      startQuiz(difficulty);
    }
  }, [difficulty, total, loading, startQuiz]);

  // FINISH
  const finishQuiz = useCallback(
    async (latest = []) => {
      setFinished(true);
      setSubmitting(true);
      setError(null);
      stopTimer();

      try {
        const payloadAnswers = Object.keys(answers)
          .map((k) => Number(k))
          .sort((a, b) => a - b)
          .map((qi) => answers[qi]);

        const toSend = payloadAnswers.concat(latest || []).filter(Boolean);

        // spara snapshot för resultatsidan
        setSubmittedAnswers(
          Object.fromEntries(toSend.map((a) => [a.questionId, a.selectedIndex]))
        );

        const res = await submitQuiz({
          difficulty: difficulty || "easy",
          answers: toSend,
        });
        setScore(Number(res?.score ?? 0));
        setResult(Array.isArray(res?.breakdown) ? res.breakdown : []);
      } catch (e) {
        console.error(e);
        setError(e?.message || "Kunde inte spara/räkna resultat");
      } finally {
        setSubmitting(false);
      }
    },
    [answers, difficulty, stopTimer]
  );

  // NEXT
  const goNextInternal = useCallback(
    async (latestAnswerArray, answersSnapshot) => {
      if (orderPos < order.length - 1) {
        setOrderPos((p) => p + 1);
        resetTimer(10);
        return;
      }

      const a = answersSnapshot || answers;
      const unanswered = order.filter(
        (qi) => !Object.prototype.hasOwnProperty.call(a, qi)
      );

      if (unanswered.length === 0) {
        await finishQuiz(latestAnswerArray);
        return;
      }

      setOrder(unanswered);
      setOrderPos(0);
      resetTimer(10);
    },
    [orderPos, order, answers, resetTimer, finishQuiz]
  );

  // Timeout
  const handleTimeout = useCallback(() => {
    let snapshot = answers;
    if (!Object.prototype.hasOwnProperty.call(answers, currentQuestionIndex)) {
      snapshot = {
        ...answers,
        [currentQuestionIndex]: {
          questionId: currentQuestion?.id ?? null,
          selectedIndex: null,
        },
      };
      setAnswers(snapshot);
    }
    goNextInternal(undefined, snapshot);
  }, [answers, currentQuestionIndex, currentQuestion, goNextInternal]);

  useEffect(() => {
    onTimeoutRef.current = handleTimeout;
  }, [handleTimeout]);

  // ACTIONS
  const selectOption = useCallback(
    (optionIndex) => {
      setSelected(optionIndex);
      stopTimer();
    },
    [stopTimer]
  );

  const skip = useCallback(() => {
    if (!canSkip) return;
    stopTimer();
    setOrder((prev) => {
      const clone = prev.slice();
      const moved = clone.splice(orderPos, 1)[0];
      clone.push(moved);
      return clone;
    });
    setSelected(null);
    resetTimer(10);
  }, [canSkip, orderPos, resetTimer, stopTimer]);

  const next = useCallback(() => {
    if (selected == null) return;

    const q = currentQuestion;
    if (!q) {
      resetTimer(10);
      return;
    }

    const answersAfter = {
      ...answers,
      [currentQuestionIndex]: {
        questionId: q.id,
        selectedIndex: selected, // <-- skickar index istället för svar-id
      },
    };

    setAnswers(answersAfter);
    setSelected(null);

    goNextInternal([{ questionId: q.id, selectedIndex: selected }], answersAfter);
  }, [selected, currentQuestion, currentQuestionIndex, answers, goNextInternal, resetTimer]);

  // HOME
  const goHome = useCallback(() => {
    stopTimer();
    setDifficulty(null);
    setQuestions([]);
    setOrder([]);
    setOrderPos(0);
    setSelected(null);
    setAnswers({});
    setScore(0);
    setResult([]);
    setSubmittedAnswers({});
    setFinished(false);
    setError(null);
  }, [stopTimer]);

  const value = useMemo(
    () => ({
      difficulty,
      setDifficulty,
      questions,
      index: orderPos,
      selected,
      score,
      result,
      submittedAnswers,
      finished,
      loading,
      submitting,
      error,
      secondsLeft,
      canSkip,
      currentQuestion,
      total,
      startQuiz,
      selectOption,
      skip,
      next,
      goHome,
    }),
    [
      difficulty,
      questions,
      orderPos,
      selected,
      score,
      result,
      submittedAnswers,
      finished,
      loading,
      submitting,
      error,
      secondsLeft,
      canSkip,
      currentQuestion,
      total,
      startQuiz,
      selectOption,
      skip,
      next,
      goHome,
    ]
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}
