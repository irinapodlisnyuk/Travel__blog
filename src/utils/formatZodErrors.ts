import { ZodError, ZodIssue } from "zod"; 

export const formatZodErrors = (error: ZodError): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};

  // ИСПРАВЛЕНО: Вместо error.errors используем встроенный массив error.issues
  error.issues.forEach((issue: ZodIssue) => {
    // Получаем имя поля 
    const fieldName = issue.path[0]; 
    
    if (fieldName) {
      formattedErrors[fieldName.toString()] = issue.message;
    }
  });

  return formattedErrors;
};