import { FormField } from "../FormField";
import { fetchMe, loginUser } from "../../../api/User";
import styles from "./loginForm.module.scss";
import customStyles from "./custom-login.module.scss";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/types/Icon";

export const LoginForm: FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Состояния для интерфейса
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputError= error ? customStyles["custom__input--error"] : "";

  const handleGoToRegister = () => {
    navigate("/register");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 1. Вызываем функцию логина
      const { token } = await loginUser(email, password);

      // 2. Сохраняем токен 
      localStorage.setItem("token", token);

      // 3. Сразу запрашиваем данные профиля, чтобы знать имя пользователя
      const userData = await fetchMe();
      if (userData) {
        localStorage.setItem("userName", userData.full_name);
      }
      navigate("/profile");

      // Маленький хак: перезагрузим страницу, чтобы Header увидел изменения в localStorage
      //window.location.reload();
    } catch (error: any) {
        setError("Неправильный логин или пароль"); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form__login} onSubmit={handleSubmit}>
      <div className={styles["form__login-wrapper"]}>
        {error && <p className={styles["form__login-error"]}>{error}</p>}

        <div className={styles["form__login-field"]}>
          <FormField label="Логин" icon={<Icon name="icon-label" />}>
            <input
              className={`${customStyles["custom__input"]} ${inputError}`}
              type="email"
              placeholder="Email"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
            />
          </FormField>

          <FormField
            label="Пароль"
            icon={<Icon name="icon-label" />}
          >
            <input
              className={`${customStyles["custom__input"]} ${inputError}`}
              type="password"
              placeholder="Пароль"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
            />
          </FormField>
        </div>
      </div>
      <div className={styles["form__login-btn"]}>
        <button
          type="button"
          className={`${styles["form__login-secondary-btn"]} ${styles.btn}`}
          onClick={handleGoToRegister}
          disabled={isLoading}
        >
          Зарегистрироваться
        </button>
        <button
          type="submit"
          className={`${styles["form__login-submit-btn"]} ${styles.btn}`}
          disabled={isLoading}
        >
          Войти
        </button>
      </div>
    </form>
  );
};
