import { useState } from "react";
import { LoginForm } from "../LoginForm";
import { RegisterForm } from "../RegisterForm";

import styles from './AuthForm.module.scss';


export const AuthForm = () => {
  const [authType, setAuthType] = useState<"auth" | "register">("auth");

  return (
    <div className={styles["auth-form"]}>

      {authType === "register" ? (
        <RegisterForm onSuccess={() => setAuthType("auth")} />
      ) : (
        <LoginForm onSwitchToRegister={() => setAuthType("register")} />
      )}
      
    </div>
  );
};