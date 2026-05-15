import { FC } from "react";
import "./FormField.scss";
import { IFormFieldProps } from "@/components/types/form";


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
