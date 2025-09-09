import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DifficultySelect from "./components/DifficultySelect";
import QuizProvider from "./context/QuizProvider"; 

export default function App() {
  const handleStart = () => alert("Startar quiz…");

  return (
    <QuizProvider>
      <Navbar />
      <div className="container">
        <Hero />
        <DifficultySelect onStart={handleStart} />
      </div>
    </QuizProvider>
  );
}
