# CleverClub – QuizDashboard

## Kom igång
1) npm i
2) Kopiera `.env.example` till `.env.local`
   - Utan backend: VITE_USE_MOCK=1
   - Med backend:  VITE_USE_MOCK=0 och VITE_API_URL=http://localhost:3000
3) npm run dev

## Struktur
src/
  components/  (Hero, DifficultyCard, DifficultySelect, Navbar)
  pages/       (QuizRun)
  context/     (QuizContext.js, QuizProvider.jsx)
  hooks/       (useQuiz.js)
  lib/         (api.js – här byter ni till riktig DB/API)

## API-kontrakt (frontend förväntar sig)
GET /api/quizzes?difficulty=easy|medium|hard
Svar:
[
  { "id": "q1", "text": "Frågetext", "options": ["A","B","C"], "correctIndex": 1 }
]

## Flöde
/  -> välj svårighetsgrad -> Starta -> /quiz (progress, fråga, svar, hoppa över, nästa)
