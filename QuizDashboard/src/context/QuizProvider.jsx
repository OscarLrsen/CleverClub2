import { useCallback, useEffect, useState } from "react";
import QuizContext from "./QuizContext";
import { fetchQuestionsByDifficulty } from "../lib/api";

export default function QuizProvider({ children }) {
  // UI-state
  const [difficulty, setDifficulty] = useState(null); // 'easy' | 'medium' | 'hard'
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  // Starta / ladda frågor (useCallback för att vara stabil)
  const startQuiz = useCallback(async (diff) => {
    const d = diff || difficulty || "easy";
    setDifficulty(d);
    setLoading(true);
    try {
      const qs = await fetchQuestionsByDifficulty(d);
      setQuestions(qs);
      setIndex(0);
      setSelected(null);
      setScore(0);
      setFinished(false);
    } finally {
      setLoading(false);
    }
  }, [difficulty]);

  // Autostarta när difficulty ändras
  useEffect(() => {
    if (difficulty && !questions.length) {
      startQuiz(difficulty);
    }
  }, [difficulty, questions.length, startQuiz]);

  // Val av svar
  function selectOption(i) {
    setSelected(i);
  }

  // Navigering mellan frågor
  function skip() {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  }

  function next() {
    if (selected == null) return;
    const correct = questions[index]?.correctIndex;
    if (selected === correct) setScore((s) => s + 100); // justera poängregler senare

    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  }

  // Exposed API till resten av appen
  const value = {
    difficulty, setDifficulty,
    questions, index, selected, score, finished, loading,
    startQuiz, selectOption, skip, next,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}
