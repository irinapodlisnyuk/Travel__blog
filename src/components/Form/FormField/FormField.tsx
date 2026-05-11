import { FC, ReactNode } from "react";
import "./FormField.scss";

interface IFormFieldProps {
  children: ReactNode;
  errorMessage?: string;
  className?: string;
  label?: string;
}

export const FormField: FC<IFormFieldProps> = ({
  children,
  errorMessage,
  label,
  className = "",
}) => {
  return (
    <label className={`form-field ${className}`}>
      {label && <span className="form-field__label"> * {label}</span>}
      <div className="form-field__control">{children}</div>
      {errorMessage && (
        <span className="form-field__error-text">{errorMessage}</span>
      )}
    </label>
  );
};
