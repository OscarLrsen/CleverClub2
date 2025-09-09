import React from "react";
import "./registerpage.css";

export default function RegisterPage() {
  return (
    <div className="reg-page">
      <div className="reg-container">
        <h1 className="reg-title">Registrera dig för CleverClub</h1>

        <form className="reg-form">
          <div className="field">
            <label>Förnamn</label>
            <input type="text" placeholder="" />
          </div>

          <div className="field">
            <label>Efternamn</label>
            <input type="text" placeholder="" />
          </div>

          <div className="field">
            <label>Användarnamn</label>
            <input type="text" placeholder="" />
          </div>

          <div className="field">
            <label>E-post</label>
            <input type="email" placeholder="" />
          </div>

          <div className="field">
            <label>Ålder</label>
            <input type="number" placeholder="" />
          </div>

          <div className="field">
            <label>Lösenord</label>
            <input type="password" placeholder="" />
          </div>

          <div className="field">
            <label>Bekräfta lösenord</label>
            <input type="password" placeholder="" />
          </div>

          {/* knappen gör inget (type="button") */}
          <button type="button" className="reg-button">
            Registrera dig
          </button>

          <p className="reg-footnote">
            Har du redan ett konto? <a href="/login">Logga in</a>
          </p>
        </form>
      </div>
    </div>
  );
}
