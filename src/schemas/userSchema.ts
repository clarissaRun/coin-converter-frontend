import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El correo es obligatorio")
    .pipe(z.email({ error: "Correo inválido" })),
  password: z.string().min(10, "La contraseña debe tener mínimo 10 caracteres"),
});

export const RegisterSchema = z
  .object({
    firstName: z.string().trim().min(1, "El nombre es obligatorio"),
    lastName: z.string().trim().min(1, "El apellido es obligatorio"),
    email: z
      .string()
      .trim()
      .min(1, "El correo es obligatorio")
      .pipe(z.email({ error: "Correo inválido" })),
    password: z
      .string()
      .min(10, "La contraseña debe tener mínimo 10 caracteres"),
    confirmPassword: z.string().min(10, "La confirmación es obligatoria"),
  })

  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type LoginValues = z.infer<typeof LoginSchema>;
export type RegisterValues = z.infer<typeof RegisterSchema>;
