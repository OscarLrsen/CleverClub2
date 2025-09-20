import React, { useEffect, useState } from "react";
import { fetchQuestions, deleteQuestion } from "../apis/quizApis";

const AdminQuestionManager = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions().then((res) => setQuestions(res.data));
  }, []);

  const handleDelete = async (id) => {
    await deleteQuestion(id);
    setQuestions((prev) => prev.filter((q) => q._id !== id));
  };

  return (
    <div>
      <h2>Hantera frågor</h2>
      {questions.map((q) => (
        <div key={q._id}>
          <p>
            {q.text} ({q.difficulty})
          </p>
          <button onClick={() => handleDelete(q._id)}>Ta bort</button>
        </div>
      ))}
    </div>
  );
};

export default AdminQuestionManager;
