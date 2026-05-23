import z from "zod";

export const CreateRegisterSchema = z
  .object({
    email: z
      .string()
      .min(1, "Введите Email")
      .min(4, "Email должен быть не менее 4 символов")
      .email({ message: "Некорректный формат Email" }),
    password: z.string().min(6, "Пароль не менее 6 символов"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Пароли не совпадают",
    path: ["password"],
  });

export type RegisterFormData = z.infer<typeof CreateRegisterSchema>;