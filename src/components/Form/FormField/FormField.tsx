import { FC, ReactNode } from "react";
import "./FormField.scss";

interface IFormFieldProps {
  children: ReactNode;
  errorMessage?: string;
  className?: string;
  label?: string;
  icon?: ReactNode;
}

export const FormField: FC<IFormFieldProps> = ({
  children,
  errorMessage,
  label,
  icon,
  className = "",
}) => {
  return (
    <label className={`form-field ${className}`}>
      {label && (
        <div className="form-field__wrapper">
          {icon && <span className="form-field__icon">{icon}</span>}
          <span className="form-field__label">{label}</span>
        </div>
      )}
      <div className="form-field__control">{children}</div>
      {errorMessage && (
        <span className="form-field__error-text">{errorMessage}</span>
      )}
    </label>
  );
};
