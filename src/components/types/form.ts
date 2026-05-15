import { ReactNode } from "react";

export interface IFormFieldProps {
  children: ReactNode;
  errorMessage?: string;
  className?: string;
  label?: string;
  icon?: ReactNode;
}

export interface RegisterFormProps {
  onSuccess?: () => void;
}
