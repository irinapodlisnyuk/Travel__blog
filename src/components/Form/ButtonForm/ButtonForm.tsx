import { FC } from "react";
import { useNavigate } from "react-router-dom";
import customStyles from "../LoginForm/custom-login.module.scss";
import styles from "./ButtonForm.module.scss";
import Icon from "@/components/types/Icon";

interface ButtonFormProps {
  isSubmitting: boolean;
}

export const ButtonForm: FC<ButtonFormProps> = ({ isSubmitting }) => {
  const navigate = useNavigate();

  return (
    <div className={styles["control__btn"]}>
      <button
        type="button"
        className={`${styles["control__back-btn"]} ${styles.btn}`}
        disabled={isSubmitting} // Блокируем кнопку "Назад" во время отправки
        onClick={() => navigate(-1)}
      >
        <Icon name="back-icon" className={styles["control__back-icon"]} />
        Назад
      </button>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`${styles["control__save-btn"]} ${customStyles["btn"] || ""}`}
      >
        {isSubmitting ? "Сохранение..." : "Сохранить"}
      </button>
    </div>
  );
};