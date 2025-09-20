import { useEffect, useState } from "react";
import axios from "axios";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    _id: "",
    text: "",
    options: ["", "", ""],
    correctIndex: 0,
    difficulty: "easy",
    points: 25,
  });
  const [editingId, setEditingId] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState(null);

  const fetchUsers = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/users?username=admin"
    );
    setUsers(res.data);
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
    fetchUsers();
  };

  const fetchQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/questions");
      if (Array.isArray(res.data)) {
        setQuestions(res.data);
      } else {
        console.warn(" Backend returnerade inte en array:", res.data);
        setQuestions([]);
      }
    } catch (err) {
      console.error(" Fel vid hämtning av frågor:", err);
      setQuestions([]);
    }
  };

  const deleteQuestion = async (id) => {
    await axios.delete(`http://localhost:5000/api/admin/questions/${id}`);
    fetchQuestions();
  };

  const addQuestion = async () => {
    await axios.post("http://localhost:5000/api/admin/questions", newQuestion);
    setNewQuestion({
      _id: "",
      text: "",
      options: ["", "", ""],
      correctIndex: 0,
      difficulty: "easy",
      points: 25,
    });
    fetchQuestions();
  };

  const startEdit = (q) => {
    setEditingId(q._id);
    setEditedQuestion({ ...q });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedQuestion(null);
  };

  const saveEdit = async () => {
    await axios.put(
      `http://localhost:5000/api/admin/questions/${editingId}`,
      editedQuestion
    );
    cancelEdit();
    fetchQuestions();
  };

  useEffect(() => {
    fetchUsers();
    fetchQuestions();
  }, []);

  return (
    <div>
      <h2>Adminpanel – Användare</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.username} ({user.email}) {user.password}
            <button onClick={() => deleteUser(user._id)}>Ta bort</button>
          </li>
        ))}
      </ul>

      <h2>Adminpanel – Frågor</h2>
      <ul>
        {questions.map((q) => (
          <li key={q._id}>
            {editingId === q._id ? (
              <div>
                <input
                  value={editedQuestion.text}
                  onChange={(e) =>
                    setEditedQuestion({
                      ...editedQuestion,
                      text: e.target.value,
                    })
                  }
                  placeholder="Frågetext"
                />
                <input
                  value={editedQuestion.points}
                  type="number"
                  onChange={(e) =>
                    setEditedQuestion({
                      ...editedQuestion,
                      points: Number(e.target.value),
                    })
                  }
                  placeholder="Poäng"
                />
                <input
                  value={editedQuestion.correctIndex}
                  type="number"
                  onChange={(e) =>
                    setEditedQuestion({
                      ...editedQuestion,
                      correctIndex: Number(e.target.value),
                    })
                  }
                  placeholder="Rätt index"
                />
                <input
                  value={editedQuestion.options[0]}
                  onChange={(e) => {
                    const opts = [...editedQuestion.options];
                    opts[0] = e.target.value;
                    setEditedQuestion({ ...editedQuestion, options: opts });
                  }}
                  placeholder="Alternativ 1"
                />
                <input
                  value={editedQuestion.options[1]}
                  onChange={(e) => {
                    const opts = [...editedQuestion.options];
                    opts[1] = e.target.value;
                    setEditedQuestion({ ...editedQuestion, options: opts });
                  }}
                  placeholder="Alternativ 2"
                />
                <input
                  value={editedQuestion.options[2]}
                  onChange={(e) => {
                    const opts = [...editedQuestion.options];
                    opts[2] = e.target.value;
                    setEditedQuestion({ ...editedQuestion, options: opts });
                  }}
                  placeholder="Alternativ 3"
                />
                <button onClick={saveEdit}>Spara</button>
                <button onClick={cancelEdit}>Avbryt</button>
              </div>
            ) : (
              <div>
                <strong>{q.text}</strong> ({q.difficulty}) – Poäng: {q.points}
                <br />
                Alternativ: {q.options.join(" | ")} – Rätt:{" "}
                {q.options[q.correctIndex]}
                <br />
                <button onClick={() => startEdit(q)}>Redigera</button>
                <button onClick={() => deleteQuestion(q._id)}>Ta bort</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <h3>Lägg till ny fråga</h3>
      <input
        value={newQuestion._id}
        onChange={(e) =>
          setNewQuestion({ ...newQuestion, _id: e.target.value })
        }
        placeholder="ID (t.ex. easy_001)"
      />
      <input
        value={newQuestion.text}
        onChange={(e) =>
          setNewQuestion({ ...newQuestion, text: e.target.value })
        }
        placeholder="Frågetext"
      />
      <input
        value={newQuestion.options[0]}
        onChange={(e) => {
          const opts = [...newQuestion.options];
          opts[0] = e.target.value;
          setNewQuestion({ ...newQuestion, options: opts });
        }}
        placeholder="Alternativ 1"
      />
      <input
        value={newQuestion.options[1]}
        onChange={(e) => {
          const opts = [...newQuestion.options];
          opts[1] = e.target.value;
          setNewQuestion({ ...newQuestion, options: opts });
        }}
        placeholder="Alternativ 2"
      />
      <input
        value={newQuestion.options[2]}
        onChange={(e) => {
          const opts = [...newQuestion.options];
          opts[2] = e.target.value;
          setNewQuestion({ ...newQuestion, options: opts });
        }}
        placeholder="Alternativ 3"
      />
      <input
        type="number"
        value={newQuestion.correctIndex}
        onChange={(e) =>
          setNewQuestion({
            ...newQuestion,
            correctIndex: Number(e.target.value),
          })
        }
        placeholder="Rätt index"
      />
      <input
        type="number"
        value={newQuestion.points}
        onChange={(e) =>
          setNewQuestion({ ...newQuestion, points: Number(e.target.value) })
        }
        placeholder="Poäng"
      />
      <select
        value={newQuestion.difficulty}
        onChange={(e) =>
          setNewQuestion({ ...newQuestion, difficulty: e.target.value })
        }
      >
        <option value="easy">Enkel</option>
        <option value="medium">Medel</option>
        <option value="hard">Svår</option>
      </select>
      <button onClick={addQuestion}>Lägg till fråga</button>
    </div>
  );
}

export default AdminPanel;
