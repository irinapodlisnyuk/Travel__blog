import { FormField } from "../FormField";
import { fetchMe, loginUser } from "../../../api/User";
import styles from "./LoginForm.module.scss";
import "./Custom-login.scss";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onSwitchToRegister: () => void; // Добавляем пропс для переключения
}

export const LoginForm: FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Состояния для интерфейса
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 1. Вызываем функцию логина
      const { token } = await loginUser(email, password);

      // 2. Сохраняем токен в "память" браузера
      localStorage.setItem("token", token);

      // 3. Сразу запрашиваем данные профиля, чтобы знать имя пользователя
      const userData = await fetchMe();
      if (userData) {
        localStorage.setItem("userName", userData.name);
      }
      navigate("/profile");

      // Маленький хак: перезагрузим страницу, чтобы Header увидел изменения в localStorage
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles["login__form"]} onSubmit={handleSubmit}>
      <div className={styles["login__form-field"]}>
        <FormField
          label="Логин"
          errorMessage={error && error.includes("email") ? error : undefined}
        >
          <input
            className={styles["custom__input"]}
            type="email"
            placeholder="Email"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
          />
        </FormField>

        <FormField
          label="Пароль"
          errorMessage={error && error.includes("пароль") ? error : undefined}
        >
          <input
            className={styles["custom__input"]}
            type="password"
            placeholder="Пароль"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
          />
        </FormField>
      </div>
      <div className={styles["login__form-btn"]}>
        <button
          type="button" // ОБЯЗАТЕЛЬНО type="button", чтобы не отправлять форму
          className={styles["login__secondary-btn"]}
          onClick={onSwitchToRegister}
          disabled={isLoading}
        >
          Зарегистрироваться
        </button>
        <button
          type="submit"
          className={styles["login__submit-btn"]}
          disabled={isLoading}
        >
          Войти
        </button>
      </div>
    </form>
  );
};
