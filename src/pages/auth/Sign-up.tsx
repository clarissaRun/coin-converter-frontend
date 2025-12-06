import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterValues } from "../../schemas/userSchema";
import { useAuth } from "../../hooks/useAuth";

export default function SignUpPage() {
  // 1. Initialize useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(RegisterSchema),
  });

  const navigate = useNavigate();
  const { register: authRegister, isLoading, error: apiError } = useAuth();

  // 4. onSubmit actualizado para llamar a la API
  const onSubmit = async (data: RegisterValues) => {
    const { success } = await authRegister(data);

    if (success) {
      navigate("/auth/sign-in");
    }
    // If 'success' then false, the hook saved the error in 'apiError'
  };

  return (
    <main className="min-h-screen grid place-items-center bg-gray-50 p-6">
      <form
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
        onSubmit={handleSubmit(onSubmit)} // handleSubmit to validate before calling onSubmit
        noValidate
      >
        <h1 className="text-2xl font-semibold">Crear cuenta</h1>
        <p className="text-sm text-gray-600">
          Regístrate para usar el conversor de monedas.
        </p>

        <div className="mt-6 grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* --- first name --- */}
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Nombre</span>
              <input
                id="firstName"
                placeholder="Gabriela"
                {...register("firstName")}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </label>

            {/* --- last name --- */}
            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Apellido
              </span>
              <input
                id="lastName"
                placeholder="Reyes"
                {...register("lastName")}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </label>
          </div>

          {/* --- email--- */}
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Correo</span>
            <input
              type="email"
              id="email"
              placeholder="gaby@email.com"
              {...register("email")}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </label>

          {/* --- passwords fields --- */}
          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Contraseña
            </span>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              {...register("password")}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </span>
            <input
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </label>

          {apiError && (
            <p className="text-sm text-center text-red-600">{apiError}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 h-11 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:scale-[0.99] transition disabled:opacity-50"
          >
            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
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
