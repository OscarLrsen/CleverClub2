import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", form);
      const { message, role, userId } = res.data;
      console.log("Login response:", res.data);

      if (!userId || !role) {
        alert("Felaktigt svar från servern");
        return;
      }

      const userData = { username: form.username, role, userId };
      localStorage.setItem("user", JSON.stringify(userData));
      onLogin(userData);

      alert(message);
      navigate(role === "admin" ? "/admin" : "/quiz");
    } catch (err) {
      console.error("Inloggningsfel:", err);
      alert("Fel vid inloggning – kontrollera användarnamn och lösenord");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="login-title">Logga in</h2>

          <div className="field">
            <label htmlFor="username">Användarnamn</label>
            <input
              id="username"
              name="username"
              placeholder="Användarnamn"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Lösenord</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Lösenord"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Logga in
          </button>

          <div className="login-footnote">
            {/* valfri footnote-länk/text */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
