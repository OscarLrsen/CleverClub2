import "./AboutUsPage.css";

export default function AboutUsPage() {
  return (
    <main className="cc-about">
      <section className="cc-about-header">
        <h1>Vår historia</h1>
        <p className="cc-about-tagline">Clever minds think alike.</p>
      </section>

      <section className="cc-about-content">
        <article className="cc-about-card">
          <p>
            Vi är fem engagerade studenter –{" "}
            <strong>Oscar, Kevin, Ricky, Benjamin och Ahmed</strong>, som
            tillsammans har skapat <strong>CleverClub</strong>. Idén föddes ur
            vårt gemensamma intresse för lärande och teknik, och visionen att
            göra kunskap både roligare och mer lättillgänglig.
          </p>

          <p>
            Under projektets gång har vi arbetat som ett team där alla bidragit
            med olika styrkor. Från design och kodning till testning och analys.
            Tillsammans har vi format en quizapplikation som inte bara ska vara
            ett digitalt verktyg, utan en upplevelse som väcker nyfikenhet och
            engagemang.
          </p>

          <p>
            Med <strong>CleverClub</strong> vill vi ge studenter och
            kursdeltagare en möjlighet att lära sig på ett mer interaktivt sätt.
            Istället för statiska övningar eller traditionella prov, erbjuder vi
            ett quiz där man får direkt feedback, kan utmana sina vänner och
            samtidigt upptäcka världen genom frågor om geografi.
          </p>

          <p>
            Det här projektet har inte bara handlat om att bygga en applikation,
            utan också om att utvecklas som grupp, samarbeta och skapa något vi
            kan vara stolta över. <strong>CleverClub</strong> är resultatet av
            vår resa tillsammans, och vi hoppas att det kan inspirera fler till
            att lära sig, utforska och växa.
          </p>
        </article>

        <div className="cc-about-highlights" aria-label="Höjdpunkter">
          <div className="cc-about-highlight">
            <h3>Interaktivt lärande</h3>
            <p>Direkt feedback och quiz som känns mer spel än prov.</p>
          </div>
          <div className="cc-about-highlight">
            <h3>Byggt för studenter</h3>
            <p>Skolor och lärare i fokus – engagerande och målinriktat.</p>
          </div>
          <div className="cc-about-highlight">
            <h3>Geografi i centrum</h3>
            <p>Upptäck världen och utmana vänner på vägen.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
