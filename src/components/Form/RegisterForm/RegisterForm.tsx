import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { FormField } from "../FormField/FormField";
import { registerUser } from "../../../api/User";
import { CreateRegisterSchema,  RegisterFormData} from "./RegisterSchema";
import Icon from "@/components/types/Icon";
import { RegisterFormProps } from "@/components/types/form";

import styles from "./RegisterForm.module.scss";
import customStyles from "../LoginForm/custom-login.module.scss";

export const RegisterForm: FC<RegisterFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  // Инициализируем форму 
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(CreateRegisterSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);

    try {
      const response = await registerUser(data.email, data.password);

      if (response?.token) {
        localStorage.setItem("token", response.token);
      }

      if (onSuccess) {
        onSuccess();
      }

      navigate("/profile", { state: { openEdit: true } });
    } catch (err: any) {
      const errorText = err.response?.data?.message || err.message || "";
      const lowerError = errorText.toLowerCase();

      if (
        lowerError.includes("exists") ||
        lowerError.includes("существует") ||
        lowerError.includes("taken")
      ) {
        setServerError("Аккаунт с данным email уже существует");
      } else {
        setServerError(errorText || "Произошла ошибка при регистрации");
      }
    }
  };

  return (
    <form
      className={styles["form__register"]}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div
        className={`${styles["form__register-field"]} ${serverError || errors.email || errors.password || errors.confirmPassword ? styles.hasError : ""}`}
      >
        {/* EMAIL */}
        <FormField
          label="Email"
          icon={<Icon name="icon-label" />}
          errorMessage={errors.email?.message || (serverError?.includes("email") ? serverError : undefined)}
          className={styles.first}
        >
          <input
            type="email"
            placeholder="Email"
            className={`${customStyles["custom__input"]} ${errors.email ? customStyles["custom__input--error"] : ""}`}
            {...register("email")}
          />
        </FormField>

        {/* ПАРОЛЬ */}
        <FormField
          label="Пароль"
          icon={<Icon name="icon-label" />}
          errorMessage={errors.password?.message}
        >
          <input
            type="password"
            placeholder="Пароль"
            className={`${customStyles["custom__input"]} ${errors.password ? customStyles["custom__input--error"] : ""}`}
            {...register("password")}
          />
        </FormField>

        {/* ПОДТВЕРЖДЕНИЕ ПАРОЛЯ */}
        <FormField
          label="Повторите пароль"
          icon={<Icon name="icon-label" />}
          errorMessage={errors.confirmPassword?.message}
        >
          <input
            type="password"
            placeholder="Подтвердите пароль"
            className={`${customStyles["custom__input"]} ${errors.confirmPassword ? customStyles["custom__input--error"] : ""}`}
            {...register("confirmPassword")}
          />
        </FormField>

        {serverError && !serverError.includes("email") && (
          <p className="error-message__server">{serverError}</p>
        )}
      </div>

      <button
        type="submit"
        className={`${styles["form__register-submit-btn"]} ${styles.btn}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
      </button>
    </form>
  );
};