import { useState } from "react";
import "./AdminPanel.css";

export default function AdminPanel() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "Vilket är det största landet i världen?",
      correct: "Ryssland",
      incorrect: ["Kina", "USA", "Kanada"],
      difficulty: "Medel",
    },
    {
      id: 2,
      question: "Vilken är huvudstaden i Frankrike?",
      correct: "Paris",
      incorrect: ["Berlin", "Rom", "Madrid"],
      difficulty: "Lätt",
    },
  ]);

  const [newQ, setNewQ] = useState("");
  const [newCorrect, setNewCorrect] = useState("");
  const [newWrong1, setNewWrong1] = useState("");
  const [newWrong2, setNewWrong2] = useState("");
  const [newWrong3, setNewWrong3] = useState("");
  const [newDiff, setNewDiff] = useState("");

  const handleAdd = () => {
    if (!newQ || !newCorrect || !newWrong1 || !newDiff) {
      alert("Du måste fylla i minst fråga, rätt svar, ett felaktigt svar och svårighetsgrad!");
      return;
    }
    const newQuestion = {
      id: Date.now(),
      question: newQ,
      correct: newCorrect,
      incorrect: [newWrong1, newWrong2, newWrong3].filter(Boolean),
      difficulty: newDiff,
    };
    setQuestions([...questions, newQuestion]);
    setNewQ("");
    setNewCorrect("");
    setNewWrong1("");
    setNewWrong2("");
    setNewWrong3("");
    setNewDiff("");
  };

  const handleDelete = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Quizhantering</h1>
      <p>Hantera och skapa nya quizfrågor för CleverClub.</p>

      {/* Formulär */}
      <div className="form-wrapper">
        <input
          type="text"
          placeholder="Fråga"
          value={newQ}
          onChange={(e) => setNewQ(e.target.value)}
        />
        <input
          type="text"
          placeholder="Rätt svar"
          value={newCorrect}
          onChange={(e) => setNewCorrect(e.target.value)}
        />
        <input
          type="text"
          placeholder="Felaktigt svar 1"
          value={newWrong1}
          onChange={(e) => setNewWrong1(e.target.value)}
        />
        <input
          type="text"
          placeholder="Felaktigt svar 2"
          value={newWrong2}
          onChange={(e) => setNewWrong2(e.target.value)}
        />
        <input
          type="text"
          placeholder="Felaktigt svar 3"
          value={newWrong3}
          onChange={(e) => setNewWrong3(e.target.value)}
        />

        <select value={newDiff} onChange={(e) => setNewDiff(e.target.value)}>
          <option value="">Välj svårighetsgrad</option>
          <option value="Lätt">Lätt</option>
          <option value="Medel">Medel</option>
          <option value="Svår">Svår</option>
        </select>

        <button onClick={handleAdd}>Lägg till fråga</button>
      </div>

      {/* Tabell */}
      <h2>Befintliga frågor</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Fråga</th>
            <th>Rätt svar</th>
            <th>Felaktiga svar</th>
            <th>Svårighetsgrad</th>
            <th>Åtgärder</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id}>
              <td>{q.question}</td>
              <td>{q.correct}</td>
              <td>{q.incorrect.join(", ")}</td>
              <td>{q.difficulty}</td>
              <td>
                <button className="edit-btn">Redigera</button>
                <button className="delete-btn" onClick={() => handleDelete(q.id)}>
                  Ta bort
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}