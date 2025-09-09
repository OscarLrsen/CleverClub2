// Hej Ahmed
// En enda funktion som din klasskompis kopplar till DB/APi.
// Byt inuti fetchQuestionsByDifficulty så den hämtar från er backend.
//
// Förslag på backend-endpoint (senare):
// GET /api/quizzes?difficulty=easy|medium|hard -> [{ id, text, options: [string], correctIndex }]
//
// OBS: under utveckling använder vi en enkel mock om VITE_USE_MOCK === '1'.

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "1";
const BASE = import.meta.env.VITE_API_URL || "/api";

/** Hämta frågor per svårighetsgrad. Returnerar en array:
 * [{ id: string|number, text: string, options: string[], correctIndex: number }]
 */
export async function fetchQuestionsByDifficulty(difficulty = "easy") {
  if (USE_MOCK) {
    return mockQuestions(difficulty);
  }

  // ↙️ Byt detta till er riktiga endpoint när den finns
  const url = new URL(`${BASE}/quizzes`);
  url.searchParams.set("difficulty", difficulty);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Kunde inte hämta frågor");
  const data = await res.json();

  // Om backend redan skickar i rätt format, returnera bara data.
  // Annars mappa om här:
  // return data.map(q => ({ id: q.id, text: q.text, options: q.options, correctIndex: q.correctIndex }));
  return data;
}

// ---------- MOCK (tas bort sen) ----------
function mockQuestions(difficulty) {
  const base = [
    {
      id: 1,
      text: "Vilket land är känt som 'Landet med de tusen sjöarna'?",
      options: ["Finland", "Sverige", "Norge"],
      correctIndex: 0,
    },
    {
      id: 2,
      text: "Huvudstaden i Danmark?",
      options: ["Stockholm", "Köpenhamn", "Oslo"],
      correctIndex: 1,
    },
    {
      id: 3,
      text: "Vilken planet kallas den röda planeten?",
      options: ["Mars", "Venus", "Jupiter"],
      correctIndex: 0,
    },
    {
      id: 4,
      text: "Hur många minuter är en timme?",
      options: ["60", "90", "120"],
      correctIndex: 0,
    },
    {
      id: 5,
      text: "Vilket hav ligger öster om Sverige?",
      options: ["Medelhavet", "Atlanten", "Östersjön"],
      correctIndex: 2,
    },
  ];

  if (difficulty === "medium") {
    return base.map((q) => ({ ...q, text: `${q.text} (Medel)` }));
  }
  if (difficulty === "hard") {
    return base.map((q) => ({
      ...q,
      text: `${q.text} (Svår)`,
      options: [...q.options, "Vet ej"],
    }));
  }
  return base; // easy
}
