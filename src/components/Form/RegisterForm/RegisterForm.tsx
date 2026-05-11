import { FC, useState } from "react";
import { FormField } from "../FormField/FormField";
import { registerUser } from "../../../api/User";
import z from "zod";
import "./RegisterForm.scss";
import "./Custom__register.scss";

interface RegisterFormProps {
  onSuccess: () => void;
}

// 1. Схема валидации Zod
const CreateRegisterSchema = z
  .object({
    email: z
      .string()
      .min(1, "Введите Email")
      .min(4, "Email должен быть не менее 4 символов")
      .email("Некорректный формат Email"),
    password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export const RegisterForm: FC<RegisterFormProps> = ({ onSuccess }) => {
  // Состояния для полей
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Состояния для ошибок и загрузки
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Сбрасываем ошибки

    // 2. Валидация данных через Zod перед отправкой
    const validation = CreateRegisterSchema.safeParse({
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      const formattedErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const key = issue.path[0]?.toString() || "error";
        formattedErrors[key] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    setIsLoading(true);

    try {
      // 3. Вызов твоей функции из API (только email и password по Swagger)
      await registerUser(email, password);
      onSuccess(); // Переключаем на вход
    } catch (err: any) {
      setErrors({ server: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <p className="register-form__title">Регистрация</p>
      <form className="register-form" onSubmit={handleSubmit}>
        <FormField errorMessage={errors.email}>
          <input
            type="email"
            className="custom__register"
            placeholder="Электронная почта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormField>

        <FormField errorMessage={errors.password}>
          <input
            type="password"
            placeholder="Пароль"
            className="custom__register"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormField>

        <FormField errorMessage={errors.confirmPassword}>
          <input
            className="custom__register"
            type="password"
            placeholder="Подтвердите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormField>

        {errors.server && (
          <p className="error-message__server">{errors.server}</p>
        )}

        <button
          type="submit"
          className="login__submit-btn"
          disabled={isLoading}
        >
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </button>
      </form>
    </>
  );
};
