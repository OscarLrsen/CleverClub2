import "../styles/MainPage.css";

export default function MainPage() {
  return (
    <main className="mainpage-container">
      <h1 className="mainpage-title">CleverClub</h1>
      <p className="mainpage-subtitle">
        CleverClub är en rolig och lärorik quiz-app där du kan testa dina
        geografikunskaper och lära dig mer om världen.
      </p>

      <button className="mainpage-button">Börja spela gratis</button>

      <section className="features">
        <article className="feature-card">
          <h3 className="feature-title">🌍 Testa dina geografikunskaper</h3>
          <p className="feature-desc">
            Kan du placera världens länder och städer rätt?
          </p>
        </article>

        <article className="feature-card">
          <h3 className="feature-title">🧠 Utmanande quiz med 3 alternativ</h3>
          <p className="feature-desc">Bara ett är rätt, hur många klarar du?</p>
        </article>

        <article className="feature-card">
          <h3 className="feature-title">✈️ Res jorden runt från soffan</h3>
          <p className="feature-desc">
            Lär dig nya platser samtidigt som du spelar!
          </p>
        </article>
      </section>
    </main>
  );
}
