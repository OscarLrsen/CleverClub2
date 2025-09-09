import { useState } from "react";
import QuizContext from "./QuizContext";

export default function QuizProvider({ children }) {
  const [difficulty, setDifficulty] = useState(null); // 'easy' | 'medium' | 'hard'

  const value = {
    difficulty,
    setDifficulty,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}
