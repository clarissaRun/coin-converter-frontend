import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginSchema = z.object({
  email: z.string().min(1, "El correo es obligatorio").email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
type LoginValues = z.infer<typeof LoginSchema>;

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginValues>({
      resolver: zodResolver(LoginSchema),
      mode: "onChange",
      defaultValues: { email: "", password: "" },
    });

  const onSubmit = async (values: LoginValues) => {
    void values
    // endpoint 
    // const res = await fetch("/api/login", { ... });
    // if (!res.ok) throw new Error("Credenciales inválidas");
    // const data = await res.json();
    // console.log(data);
    await new Promise(r => setTimeout(r, 400)); // demo
    alert("Login ok (demo). Reemplaza con tu navegación.");
  };

  return (
    <main className="min-h-screen grid place-items-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow ring-1 ring-gray-100"
      >
        <h1 className="mb-1 text-xl font-semibold text-gray-900">Iniciar sesión</h1>
        <p className="mb-4 text-sm text-gray-500">Accede a tu cuenta</p>

        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Correo
        </label>
        <input
          id="email"
          type="email"
          className="mt-1 mb-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          placeholder="tu@email.com"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && <p className="mb-2 text-xs text-red-600">{errors.email.message}</p>}

        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          className="mt-1 mb-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          placeholder="••••••••"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && (
          <p className="mb-2 text-xs text-red-600">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
