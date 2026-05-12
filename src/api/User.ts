import { z } from "zod";
import { validateResponse } from "./validateResponse";

export const TokenSchema = z.object({
  token: z.string(),
});

export type TokenResponse = z.infer<typeof TokenSchema>;

export const UserSchema = z.object({
  id: z.number(),
  full_name: z.string(), // Принимает "" как валидную строку
  city: z.string().nullable().or(z.string()), // Принимает и null, и ""
  country: z.string().nullable().or(z.string()),
  bio: z.string().nullable().or(z.string()),
  photo: z.string().nullable().or(z.string()), // Добавили поле photo из вашего JSON
  email: z.string().optional(),
  token: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

export async function loginUser(
  email: string,
  password: string,
): Promise<TokenResponse> { 
  const response = await fetch(`/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const validatedRes = await validateResponse(response);
  const data = await validatedRes.json();
  
  const result = TokenSchema.parse(data); // Валидируем только токен
  
  localStorage.setItem("token", result.token);
  
  return result; // Теперь типы совпадают
}

// 2. РЕГИСТРАЦИЯ
export async function registerUser(
  email: string,
  password: string,
): Promise<TokenResponse> {
  const response = await fetch(`/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const validatedRes = await validateResponse(response);
  const data = await validatedRes.json();
  
  const result = TokenSchema.parse(data);
  localStorage.setItem("token", result.token); 
  
  return result;
}


// ВЫХОД
export async function logoutUser(): Promise<void> {
  const token = localStorage.getItem("token");

  try {
    await fetch(`/api/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Ошибка при запросе на логаут:", error);
  } finally {
    localStorage.removeItem("token");
  }
}

export async function fetchMe(): Promise<User | null> {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const response = await fetch(`/api/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    return null;
  }

  if (!response.ok) {
    throw new Error("Не удалось загрузить данные пользователя");
  }

  const validatedRes = await validateResponse(response);
  const data = await validatedRes.json();

  return UserSchema.parse(data);
}
