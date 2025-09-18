import { useNavigate } from "react-router-dom";
import useQuiz from "../hooks/useQuiz";
import DifficultyCard from "../components/DifficultyCard";

import easy from "../../assets/easy.jpg";
import medium from "../../assets/medium.jpg";
import hard from "../../assets/hard.jpg";

export default function DifficultySelect({ onStart }) {
  const { difficulty, setDifficulty } = useQuiz();
  const navigate = useNavigate();

  const handleStart = () => {
    if (!difficulty) return;
    if (typeof onStart === "function") onStart();
    else navigate("/quizdashboard/quiz");
  };

  return (
    <section className="select-wrap">
      <h2>Välj Svårighetsgrad</h2>
      <p className="lead">
        Välj en svårighetsgrad som passar dina kunskaper och färdigheter. Ju högre
        svårighetsgrad, desto mer utmanande blir frågorna.
      </p>

      <div className="diff-list">
        <DifficultyCard
          title="Lätt"
          subtitle="Perfekt för nybörjare"
          img={easy}
          selected={difficulty === "easy"}
          onSelect={() => setDifficulty("easy")}
        />
        <DifficultyCard
          title="Medel"
          subtitle="Utmanande för de flesta"
          img={medium}
          selected={difficulty === "medium"}
          onSelect={() => setDifficulty("medium")}
        />
        <DifficultyCard
          title="Svår"
          subtitle="Endast för experter"
          img={hard}
          selected={difficulty === "hard"}
          onSelect={() => setDifficulty("hard")}
        />
      </div>

      <div className="start-row">
        <button className="btn primary" disabled={!difficulty} onClick={handleStart}>
          Starta Quiz
        </button>
      </div>
    </section>
  );
}
