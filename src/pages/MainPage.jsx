import { Link } from "react-router-dom";

export default function MainPage() {
  return (
    <div className="flex flex-col items-center text-center mt-16">
      <h1 className="text-4xl font-bold mb-4">CleverClub</h1>
      <p className="max-w-lg mb-6 text-gray-600">
        CleverClub är en rolig och lärorik quiz-app där du kan testa dina
        geografikunskaper och lära dig mer om världen.
      </p>
      <button className="bg-blue-500 text-white px-6 py-2 rounded-lg mb-12 hover:bg-blue-600">
        Börja spela gratis
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="p-4 border rounded-lg shadow hover:shadow-md">
          <h3 className="font-semibold">🌍 Testa dina geografikunskaper</h3>
          <p className="text-gray-600">
            Kan du placera världens länder och städer rätt?
          </p>
        </div>
        <div className="p-4 border rounded-lg shadow hover:shadow-md">
          <h3 className="font-semibold">🧠 Utmanande quiz med 3 alternativ</h3>
          <p className="text-gray-600">
            Bara ett är rätt, hur många klarar du?
          </p>
        </div>
        <div className="p-4 border rounded-lg shadow hover:shadow-md">
          <h3 className="font-semibold">✈️ Res jorden runt från soffan</h3>
          <p className="text-gray-600">
            Lär dig nya platser samtidigt som du spelar!
          </p>
        </div>
      </div>
    </div>
  );
}
