import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/Auth.context";

export default function Navbar() {
  const { user, logout } = useAuthContext();

  useEffect(() => {
    if (user) {
      console.log("Payload del JWT (decodificado en el AuthProvider):", user);
    }
  }, [user]);

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Logo*/}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500" />
          <span className="text-lg font-semibold text-gray-900">
            Currency Converter
          </span>
        </Link>

        {/* Menú condicional*/}
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <span className="text-gray-600">
                Hola,{" "}
                <span className="font-semibold text-gray-900">
                  {user.firstName}
                </span>
              </span>
              <button
                onClick={logout}
                className="rounded-lg bg-gray-900 px-3 py-2 font-medium text-white transition hover:bg-black"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth/sign-in"
                className="rounded-lg px-3 py-2 font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/auth/sign-up"
                className="rounded-lg bg-gray-900 px-3 py-2 font-medium text-white transition hover:bg-black"
              >
                Crear Cuenta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
