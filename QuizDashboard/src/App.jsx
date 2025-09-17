import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DifficultySelect from "./components/DifficultySelect";
import QuizProvider from "./context/QuizProvider";
import QuizRun from "./pages/QuizRun";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <Hero />
      <DifficultySelect onStart={() => navigate("/quiz")} />
    </div>
  );
}

export default function App() {
  return (
    <QuizProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<QuizRun />} />
      </Routes>
    </QuizProvider>
  );
}
