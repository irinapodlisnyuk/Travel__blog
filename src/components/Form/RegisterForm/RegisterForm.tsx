import { FC, useState } from "react";
import { FormField } from "../FormField/FormField";
import { registerUser } from "../../../api/User";
import styles from "./RegisterForm.module.scss";
import customStyles from "../LoginForm/custom-login.module.scss";
import Icon from "@/components/types/Icon";
import { CreateRegisterSchema } from "./RegisterSchema";
import { useNavigate } from "react-router-dom";
import { RegisterFormProps } from "@/components/types/form";

export const RegisterForm: FC<RegisterFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Состояния для ошибок и загрузки
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Чистим старые ошибки

    // 1. Валидация Zod
    const validation = CreateRegisterSchema.safeParse({
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      const formattedErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const key = issue.path[0].toString();
        formattedErrors[key] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerUser(email, password);

      // Если бэкенд сразу возвращает токен при регистрации, сохраняем его:
      if (response?.token) {
        localStorage.setItem("token", response.token);
      }

      if (onSuccess) {
        onSuccess();
      }

      // АВТОМАТИЧЕСКИЙ ПЕРЕХОД: отправляем в профиль и открываем форму редактирования сразу
      navigate("/profile", { state: { openEdit: true } });
    } catch (err: any) {
      // Безопасно извлекаем текст ошибки, учитывая возможный ответ от Axios/Fetch структуры
      const errorText = err.response?.data?.message || err.message || "";
      const lowerError = errorText.toLowerCase();

      if (
        lowerError.includes("exists") ||
        lowerError.includes("существует") ||
        lowerError.includes("taken") ||
        lowerError.includes("token")
      ) {
        setErrors({ email: "Аккаунт с данным email уже существует" });
      } else {
        setErrors({ server: errorText || "Произошла ошибка при регистрации" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        className={styles["form__register"]}
        onSubmit={handleSubmit}
        noValidate
      >
        <div
          className={`${styles["form__register-field"]} ${errors.server ? styles.hasError : ""} ${errors.email ? styles.hasError : ""}`}
        >
          <FormField
            label="Email"
            icon={<Icon name="icon-label" />}
            errorMessage={errors.email}
            className={styles.first}
          >
            <input
              type="email"
              className={`${customStyles["custom__input"]} ${errors.email ? customStyles["custom__input--error"] : ""}`}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>

          <FormField
            label="Пароль"
            icon={<Icon name="icon-label" />}
            errorMessage={errors.password}
          >
            <input
              type="password"
              placeholder="Пароль"
              className={`${customStyles["custom__input"]} ${errors.password ? customStyles["custom__input--error"] : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>

          <FormField
            label="Повторите пароль"
            icon={<Icon name="icon-label" />}
            errorMessage={errors.confirmPassword}
          >
            <input
              className={`${customStyles["custom__input"]} ${errors.confirmPassword ? customStyles["custom__input--error"] : ""}`}
              type="password"
              placeholder="Подтвердите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormField>

          {errors.server && (
            <p className="error-message__server">{errors.server}</p>
          )}
        </div>

        <button
          type="submit"
          className={`${styles["form__register-submit-btn"]} ${styles.btn}`}
          disabled={isLoading}
        >
          Зарегистрироваться
        </button>
      </form>
    </>
  );
};
