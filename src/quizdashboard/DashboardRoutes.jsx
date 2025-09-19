import { Routes, Route } from "react-router-dom";
import QuizDashboardLayout from "./DashboardLayout";
import Hero from "./components/Hero";
import DifficultySelect from "./components/DifficultySelect";
import QuizRun from "./pages/QuizRun";


function DashboardHome() {
  return (
    <div className="container">
      <Hero />
      <DifficultySelect />
    </div>
  );
}

export default function DashboardRoutes() {
  return (
    <Routes>
      <Route element={<QuizDashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="quiz" element={<QuizRun />} />
      </Route>
    </Routes>
  );
}
