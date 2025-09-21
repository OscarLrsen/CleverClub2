import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminPanel.css";

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

  //  nytt state för tabbar
  const [activeTab, setActiveTab] = useState("questions");

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
    <div className="admin-container"> 
      <h2 className="admin-title">Adminpanel</h2>

      {/* Tabs */}
      <div className="tab-buttons">
  <button
    className={activeTab === "questions" ? "active" : ""}
    onClick={() => setActiveTab("questions")}
  >
    📝 Frågor
  </button>
  <button
    className={activeTab === "users" ? "active" : ""}
    onClick={() => setActiveTab("users")}
  >
    👥 Användare
  </button>
</div>

      {/* TAB: Användare */}
      {activeTab === "users" && (
        <div>
          <h3>Användare</h3>
          <ul className="user-list">
            {users.map((user) => (
              <li key={user._id} className="user-item">
                {user.username} ({user.email}) {user.password}
                <button className="action-btn delete-btn" onClick={() => deleteUser(user._id)}>Ta bort</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* TAB: Frågor */}
      {activeTab === "questions" && (
        <div>
          <h3>Lägg till ny fråga</h3>
          <div className="form-wrapper">
            <div className="form-field form-field--full">
              <label>ID:</label>
              <input
                value={newQuestion._id}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, _id: e.target.value })
                }
                placeholder="ID (t.ex. easy_001)"
              />
            </div>

            <div className="form-field form-field--full">
              <label>Frågetext:</label>
              <input
                value={newQuestion.text}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, text: e.target.value })
                }
                placeholder="Frågetext"
              />
            </div>

            <div className="form-field form-field--full">
              <label>Alternativ 1:</label>
              <input
                value={newQuestion.options[0]}
                onChange={(e) => {
                  const opts = [...newQuestion.options];
                  opts[0] = e.target.value;
                  setNewQuestion({ ...newQuestion, options: opts });
                }}
                placeholder="Alternativ 1"
              />
            </div>

            <div className="form-field form-field--full">
              <label>Alternativ 2:</label>
              <input
                value={newQuestion.options[1]}
                onChange={(e) => {
                  const opts = [...newQuestion.options];
                  opts[1] = e.target.value;
                  setNewQuestion({ ...newQuestion, options: opts });
                }}
                placeholder="Alternativ 2"
              />
            </div>

            <div className="form-field form-field--full">
              <label>Alternativ 3:</label>
              <input
                value={newQuestion.options[2]}
                onChange={(e) => {
                  const opts = [...newQuestion.options];
                  opts[2] = e.target.value;
                  setNewQuestion({ ...newQuestion, options: opts });
                }}
                placeholder="Alternativ 3"
              />
            </div>

            <div className="form-field form-field--half">
              <label>Poäng:</label>
              <select
                value={newQuestion.points}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, points: Number(e.target.value) })
                }
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="form-field form-field--half">
              <label>Rätt svar:</label>
              <select
                value={newQuestion.correctIndex}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, correctIndex: Number(e.target.value) })
                }
              >
                <option value={0}>Alternativ 1</option>
                <option value={1}>Alternativ 2</option>
                <option value={2}>Alternativ 3</option>
              </select>
            </div>

            <div className="form-field form-field--full">
              <label>Svårighetsgrad:</label>
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
            </div>

            <button onClick={addQuestion}>Lägg till fråga</button>
          </div>
          <h3>Befintliga frågor</h3>
          <ul className="question-list">
            {questions.map((q) => (
              <li key={q._id} className="question-item">
                {editingId === q._id ? (
                  <div>
                    <textarea
                        value={editedQuestion.text}
                        onChange={(e) =>
                          setEditedQuestion({
                            ...editedQuestion,
                            text: e.target.value,
                          })
                        }
                        placeholder="Frågetext"
                      />
                    <div className="form-field form-field--half">
                      <label>Poäng:</label>
                      <select
                        value={editedQuestion.points}
                        onChange={(e) =>
                          setEditedQuestion({ ...editedQuestion, points: Number(e.target.value) })
                        }
                      >
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                    
                    <div className="form-field form-field--half">
                        <label>Rätt svar:</label>
                        <select
                          value={editedQuestion.correctIndex}
                          onChange={(e) =>
                            setEditedQuestion({ ...editedQuestion, correctIndex: Number(e.target.value) })
                          }
                        >
                          <option value={0}>Alternativ 1</option>
                          <option value={1}>Alternativ 2</option>
                          <option value={2}>Alternativ 3</option>
                        </select>
                      </div>
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
                    <button className="action-btn save-btn" onClick={saveEdit}>Spara</button>
                    <button className="action-btn cancel-btn" onClick={cancelEdit}>Avbryt</button>
                  </div>
                ) : (
                  <div>
                    <strong>{q.text}</strong> ({q.difficulty}) – Poäng: {q.points}
                    <br />
                    Alternativ: {q.options.join(" | ")} – Rätt:{" "}
                    {q.options[q.correctIndex]}
                    <br />
                    <button className="action-btn edit-btn" onClick={() => startEdit(q)}>Redigera</button>
                    <button className="action-btn delete-btn" onClick={() => deleteQuestion(q._id)}>
                      Ta bort
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
