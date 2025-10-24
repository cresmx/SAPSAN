import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-indigo-600">
          Agua Potable
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="/dashboard" className="block px-3 py-2 rounded hover:bg-indigo-600">
            Dashboard
          </a>
          <a href="/usuarios" className="block px-3 py-2 rounded hover:bg-indigo-600">
            Usuarios
          </a>
          <a href="/reportes" className="block px-3 py-2 rounded hover:bg-indigo-600">
            Reportes
          </a>
        </nav>
        <div className="p-4 border-t border-indigo-600">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-700">Panel de control</h1>
          <div className="flex items-center space-x-3">
            <span className="text-gray-600">👤 {user?.nombre_completo}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
