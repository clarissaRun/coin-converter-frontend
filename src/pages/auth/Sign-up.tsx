import { Link } from "react-router-dom";

export default function SignUpPage() {
  return (
    <main className="min-h-screen grid place-items-center bg-gray-50 p-6">
      <form
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <h1 className="text-2xl font-semibold">Crear cuenta</h1>
        <p className="text-sm text-gray-600">
          Regístrate para usar el conversor de monedas.
        </p>

        <div className="mt-6 grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Nombre</span>
              <input
                id="firstName"
                name="firstName"
                placeholder="Gabriela"
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Apellido
              </span>
              <input
                id="lastName"
                name="lastName"
                placeholder="Reyes"
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Correo</span>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="gaby@email.com"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Contraseña
            </span>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <button
            type="submit"
            className="mt-2 h-11 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:scale-[0.99] transition"
          >
            Crear cuenta
          </button>

          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link to="/auth/sign-in" className="text-indigo-600 underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}
