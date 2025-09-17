import { useState } from "react";
import axios from "axios";

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", form);
      const { message, role } = res.data;
      alert(message);
      onLogin({ username: form.username, role });
    } catch (err) {
      alert("Fel vid inloggning");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        name="password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Logga in</button>
    </form>
  );
}

export default LoginPage;
