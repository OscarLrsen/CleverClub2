import { useState } from "react";
import API from "../services/api";
import "../styles/RegisterPage.css";

function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/register", form);
      alert(res.data.message);
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="reg-page">
      <div className="reg-container">
        <form onSubmit={handleSubmit} className="reg-form">
          <h2 className="reg-title">Registrera dig</h2>

          <div className="field">
            <label htmlFor="username">Användarnamn</label>
            <input
              id="username"
              name="username"
              placeholder="Användarnamn"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="email">E-post</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="E-post"
              value={form.email}
              onChange={handleChange}
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
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="reg-button">
            Registrera
          </button>

          <div className="reg-footnote">
            {/* valfri länk eller info under knappen */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
