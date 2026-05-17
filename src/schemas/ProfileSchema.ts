import z from "zod";

export const ProfileSchema = z
  .object({
    fullName: z.string().min(1, "Поле ФИО обязательно для заполнения"),
    city: z.string().optional(),
    bio: z.string().max(600, "Максимум 600 символов").optional(),
    newPassword: z.string().optional(),
    repeatPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length < 6) return false;
      return true;
    },
    {
      message: "Пароль должен быть от 6 символов",
      path: ["newPassword"],
    }
  )
  .refine((data) => data.newPassword === data.repeatPassword, {
    message: "Пароли не совпадают",
    path: ["newPassword"],
  });

export type ProfileFormData = z.infer<typeof ProfileSchema>;