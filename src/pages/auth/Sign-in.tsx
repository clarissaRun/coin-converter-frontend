import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/Auth.context";

const LoginSchema = z.object({
  email: z.string().min(1, "El correo es obligatorio").email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
type LoginValues = z.infer<typeof LoginSchema>;

export default function SignIn() {
  const { login, isLoading, error, user } = useAuthContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (error) {
      setError("root", { message: error });
    }
  }, [error, setError]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onSubmit = async (values: LoginValues) => {
    await login(values.email, values.password);
  };

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gray-900" />
            <span className="text-lg font-semibold text-gray-900">
              Coin Converter
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a className="hover:text-gray-900" href="#">
              Precios
            </a>
            <a className="hover:text-gray-900" href="#">
              Documentación
            </a>
            <a className="hover:text-gray-900" href="#">
              Soporte
            </a>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Col izquierda: Copy / beneficios */}
          <section className="lg:col-span-7">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Bienvenido(a) de nuevo.
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-gray-600">
              Inicia sesión para gestionar tus conversiones, favoritos y tu
              historial en tiempo real.
            </p>

            <div className="mt-10 grid max-w-2xl gap-6 sm:grid-cols-2">
              <Feature title="Tipos de cambio en vivo" />
              <Feature title="Historial de conversiones" />
              <Feature title="Favoritos multi-divisa" />
            </div>
          </section>

          {/* Col derecha: Card con el formulario */}
          <section className="lg:col-span-5">
            <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">
                Iniciar sesión
              </h2>
              <p className="mt-1 text-sm text-gray-500">Accede a tu cuenta</p>

              {/* Error general */}
              {errors.root?.message && (
                <div
                  role="alert"
                  className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  {errors.root.message}
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-5"
                noValidate
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Correo
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                    className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none ring-0 transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                    className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Entrando…" : "Entrar"}
                </button>

                <p className="text-center text-sm text-gray-500">
                  ¿No tienes cuenta?{" "}
                  <a
                    href="/sign-up"
                    className="font-medium text-gray-900 hover:underline"
                  >
                    Crear cuenta
                  </a>
                </p>
              </form>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-gray-500">
          © {new Date().getFullYear()} Coin Converter. Todos los derechos
          reservados.
        </div>
      </footer>
    </div>
  );
}

function Feature({ title }: { title: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white/60 p-4 shadow-sm">
      <span className="mt-0.5 inline-block h-2.5 w-2.5 rounded-full bg-gray-900" />
      <div className="text-sm">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-gray-600">Disponible en tu panel.</p>
      </div>
    </div>
  );
}
