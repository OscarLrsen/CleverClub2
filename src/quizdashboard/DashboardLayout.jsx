import { Outlet } from "react-router-dom";
import QuizProvider from "./context/QuizProvider";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero"; 

import "./styles/index.css";


export default function QuizDashboardLayout() {
  return (
    <QuizProvider>
      <div className="quizdash">
        <Navbar />
        <Outlet />
      </div>
    </QuizProvider>
  );
}
