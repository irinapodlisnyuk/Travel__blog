//import { AuthForm } from "@/components/Form/AuthForm/AuthForm";
import { RegisterForm } from "@/components/Form/RegisterForm";
import styles from "./RegisterPage.module.scss";
import { useNavigate } from "react-router-dom";

export const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    console.log("Регистрация успешна");
    navigate("/login");
  };
  return (
    <section className={styles.register}>
      <div className="container">
        <div className={styles["register__wrapper"]}>
          <h2 className={styles["register__title"]}>Регистрация</h2>
          <RegisterForm onSuccess={handleRegisterSuccess} />
        </div>
      </div>
    </section>
  );
};
