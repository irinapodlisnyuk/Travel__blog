import { z } from "zod";
import { BASE_URL } from "./config";
import { validateResponse } from "./validateResponse";

// Схема для токена
export const UserSchema = z.object({
  token: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export const UserInfoSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  city: z.string().nullable(), // Город может быть не заполнен
  bio: z.string().nullable(),
});

export type UserInfo = z.infer<typeof UserInfoSchema>;


// РЕГИСТРАЦИЯ
export async function registerUser(email: string, password: string): Promise<User> {
  const response = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const validatedRes = await validateResponse(response);
  const data = await validatedRes.json();
  return UserSchema.parse(data);
}

// ЛОГИН
export async function loginUser(email: string, password: string): Promise<User> {
  const response = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const validatedRes = await validateResponse(response);
  const data = await validatedRes.json();
  return UserSchema.parse(data);
}

// ВЫХОД
export async function logoutUser(): Promise<void> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/api/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  await validateResponse(response);
}

export async function fetchMe(): Promise<UserInfo | null> {
  const token = localStorage.getItem("token");
  
  if (!token) return null;

  const response = await fetch(`${BASE_URL}/api/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  // Если токен протух или неверный, сервер вернет 401
  if (response.status === 401) {
    localStorage.removeItem("token");
    return null;
  }

  const validatedRes = await validateResponse(response);
  const data = await validatedRes.json();

  return UserInfoSchema.parse(data);
}