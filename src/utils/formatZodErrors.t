import { ZodError } from "zod";

export const formatZodErrors = (error: z.ZodError) => {
  const formattedErrors: Record<string, string> = {};
  
  error.issues.forEach((issue) => {
    // Получаем имя поля
    const key = issue.path[0].toString();
    formattedErrors[key] = issue.message;
  });
  
  return formattedErrors;
};