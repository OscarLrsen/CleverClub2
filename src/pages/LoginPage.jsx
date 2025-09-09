import React from "react";
import "./loginpage.css";

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Logga in</h1>

        <form className="login-form">
          <div className="field">
            <label>Användarnamn</label>
            <input type="text" placeholder="" />
          </div>

          <div className="field">
            <label>Lösenord</label>
            <input type="password" placeholder="" />
          </div>

          <button type="button" className="login-button">
            Logga in
          </button>

          <p className="login-footnote">
            Har du inget konto? <a href="/register">Registrera dig</a>
          </p>
        </form>
      </div>
    </div>
  );
}
