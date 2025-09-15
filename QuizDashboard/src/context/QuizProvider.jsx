import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QuizContext from "./QuizContext";
import { fetchQuestions, submitQuiz } from "../lib/api";

export default function QuizProvider({ children }) {
  // STATE 
  const [difficulty, setDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [order, setOrder] = useState([]);      // index i questions (kön/runda)
  const [orderPos, setOrderPos] = useState(0); // pekare i nuvarande runda

  const [selected, setSelected] = useState(null);     // valt options-index (UI)
  const [answers, setAnswers] = useState({});        

  const [score, setScore] = useState(0);
  const [result, setResult] = useState([]);           // backend breakdown
  const [submittedAnswers, setSubmittedAnswers] = useState({}); // { [questionId]: selectedAnswerId }
  const [finished, setFinished] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Timer
  const [secondsLeft, setSecondsLeft] = useState(10);
  const timerRef = useRef(null);
  const onTimeoutRef = useRef(() => {}); // undviker cirkulärt beroende

  //  DERIVED 
  const total = questions.length;
  const currentQuestionIndex = order[orderPos] ?? 0;
  const currentQuestion = questions[currentQuestionIndex] || null;

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const remainingUnanswered = useMemo(
    () => Math.max(0, total - answeredCount),
    [total, answeredCount]
  );
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
          // Anropa aktuell timeout handler via ref 
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
        const initialOrder = Array.from({ length: qs?.length || 0 }, (_, i) => i);
        setOrder(initialOrder);
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

  // Rensa timer vid unmount
  useEffect(() => stopTimer, [stopTimer]);

  // Autostarta när difficulty sätts första gången
  useEffect(() => {
    if (difficulty && total === 0 && !loading) {
      startQuiz(difficulty);
    }
  }, [difficulty, total, loading, startQuiz]);

  //  FINISH 
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

        const selMap = Object.fromEntries(
          toSend.map((a) => [a.questionId, a.selectedAnswerId ?? null])
        );
        setSubmittedAnswers(selMap);

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

  // NEXT/ROUND 
  const goNextInternal = useCallback(
    async (latestAnswerArray, answersSnapshot) => {
      // Om det finns fler i nuvarande runda → hoppa bara fram
      if (orderPos < order.length - 1) {
        setOrderPos((p) => p + 1);
        resetTimer(10);
        return;
      }

      // Använd snapshot om den finns, annars state
      const a = answersSnapshot || answers;

      // Bygg ny runda med obesvarade (utifrån snapshot a)
      const unanswered = order.filter(
        (qi) => !Object.prototype.hasOwnProperty.call(a, qi)
      );

      if (unanswered.length === 0) {
        // Alla besvarade avsluta
        await finishQuiz(latestAnswerArray);
        return;
      }

      // Ny runda med kvarvarande obesvarade
      setOrder(unanswered);
      setOrderPos(0);
      resetTimer(10);
    },
    [orderPos, order, answers, resetTimer, finishQuiz]
  );

  // Timeout-handler (definieras efter goNextInternal, bindas till ref separat)
  const handleTimeout = useCallback(() => {
    // Bygg snapshot som inkluderar den här frågan som obesvarad om den saknas
    let snapshot = answers;
    if (!Object.prototype.hasOwnProperty.call(answers, currentQuestionIndex)) {
      snapshot = {
        ...answers,
        [currentQuestionIndex]: {
          questionId: currentQuestion?.id ?? null,
          selectedAnswerId: null, // ej besvarad
        },
      };
      setAnswers(snapshot);
    }
    // Vid timeout hoppar vi vidare med snapshoten
    goNextInternal(undefined, snapshot);
  }, [answers, currentQuestionIndex, currentQuestion, goNextInternal]);

  // Håll timer timeout kopplad utan deps loop
  useEffect(() => {
    onTimeoutRef.current = handleTimeout;
  }, [handleTimeout]);

  //  ACTIONs
  const selectOption = useCallback(
    (optionIndex) => {
      // Bara markera valet; lagring sker i next()
      setSelected(optionIndex);
      stopTimer(); // pausa så man hinner se markering; ta bort om du vill att timer fortsätter
    },
    [stopTimer]
  );

  const skip = useCallback(() => {
    if (!canSkip) return;
    stopTimer();

    setOrder((prev) => {
      if (!prev.length) return prev;
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
    const opt = q?.options?.[selected];
    if (!q || !opt) {
      resetTimer(10);
      return;
    }

    // Skapa SNAPSHOT över answers så den här frågan räknas som besvarad direkt
    const answersAfter = {
      ...answers,
      [currentQuestionIndex]: {
        questionId: q.id,
        selectedAnswerId: opt.id,
      },
    };

    setAnswers(answersAfter);
    setSelected(null);

    // Gå vidare och använd snapshot (undviker att sista frågan kommer tillbaka)
    goNextInternal([{ questionId: q.id, selectedAnswerId: opt.id }], answersAfter);
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
      // state
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

      // derived
      currentQuestion,
      total,

      // actions
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
