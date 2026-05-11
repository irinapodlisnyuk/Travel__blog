import { AuthForm } from "@/components/Form/AuthForm/AuthForm"; // путь к твоему общему компоненту
import styles from "./LoginPage.module.scss";

export const LoginPage = () => {
  return (
    // Секция на всю высоту экрана, чтобы форма была по центру
    <section className={styles.login}>
      <div className="container">
        <div className={styles["login__wrapper"]}>
        <h2 className={styles["login__title"]}>Вход в профиль</h2>
        {/* <div className={styles["login__form"]}> */}
          <AuthForm />
        </div>
      </div>
    </section>
  );
};