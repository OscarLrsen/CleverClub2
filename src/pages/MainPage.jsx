import "../styles/MainPage.css";
import logo from "../assets/Cleverclub.png";
import { useNavigate, Link } from "react-router-dom"; // + Link
import Leaderboard from "../components/Leaderboard"; // + Leaderboard

export default function MainPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/login");
  };
  return (
    <main className="mainpage-container">
      <img src={logo} alt="CleverClub logotyp" className="mainpage-logo" />
      <p className="mainpage-subtitle">
        CleverClub är en rolig och lärorik quiz-app där du kan testa dina
        geografikunskaper och lära dig mer om världen.
      </p>
      <button type="button" className="mainpage-button" onClick={handleStart}>
        Börja spela gratis
      </button>

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

      <section className="home-leaderboard">
        <div className="home-leaderboard-header">
          <Link to="/leaderboard" className="home-leaderboard-link">
            Se hela listan
          </Link>
        </div>

        <div className="home-leaderboard-card">
          <Leaderboard />
          {/* Om din Leaderboard-komponent har stöd för att visa t.ex. top 5:
              <Leaderboard limit={5} /> */}
        </div>
      </section>
    </main>
  );
}
