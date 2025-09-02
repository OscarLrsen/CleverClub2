import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-100 shadow">
      <div className="text-xl font-bold">CleverClub</div>
      <div className="flex gap-4">
        <Link to="/login" className="hover:underline">
          Logga in
        </Link>
        <Link to="/register" className="hover:underline">
          Registrera
        </Link>
        <Link to="/about" className="hover:underline">
          Om oss
        </Link>
      </div>
    </nav>
  );
}
