import styles from "./LoginPage.module.scss";
import { LoginForm } from "@/components/Form/LoginForm";
export const LoginPage = () => {
  return (
    <section className={styles.login}>
      <div className="container">
        <div className={styles["login__wrapper"]}>
          <h2 className={styles["login__title"]}>Вход в профиль</h2>
          <LoginForm />
        </div>
      </div>
    </section>
  );
};
