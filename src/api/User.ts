import { validateResponse } from "./validateResponse";
import { TokenSchema, TokenResponse, UserSchema, User } from "@/schemas/userSchema";
import { BASE_URL } from "./config";

const getUrl = (path: string) => `${BASE_URL}${path}`;

// 1. АВТОРИЗАЦИЯ
export async function loginUser(
  email: string,
  password: string,
): Promise<TokenResponse> { 
  const response = await fetch(getUrl("/api/login"), {
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

// 2. РЕГИСТРАЦИЯ
export async function registerUser(
  email: string,
  password: string,
): Promise<TokenResponse> {
  const response = await fetch(getUrl("/api/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password}),
  });

  const validatedRes = await validateResponse(response);
  const data = await validatedRes.json();
  
  const result = TokenSchema.parse(data);
  localStorage.setItem("token", result.token); 
  
  return result;
}

// 3. ВЫХОД
export async function logoutUser(): Promise<void> {
  const token = localStorage.getItem("token");

  try {
    await fetch(getUrl("/api/logout"), {
      method: "GET",
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

// 4. ПОЛУЧЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ (GET /api/user)
export async function fetchMe(): Promise<User | null> {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const response = await fetch(getUrl("/api/user"), {
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

// 5. ОБНОВЛЕНИЕ ДАННЫХ ПРОФИЛЯ И АВАТАРКИ (POST /api/user)
export async function updateProfile(formData: FormData): Promise<User> {
  const token = localStorage.getItem("token");

  const response = await fetch(getUrl("/api/user"), {
    method: "POST", // Строго POST по вашему Swagger
    headers: {
      "Authorization": `Bearer ${token}`,
      // ВАЖНО: 'Content-Type' полностью отсутствует. Браузер сам создаст 'multipart/form-data'
    },
    body: formData, // Передаем объект FormData напрямую
  });

  const validatedRes = await validateResponse(response);
  const data = await validatedRes.json();

  return UserSchema.parse(data);
}

// 6. ИЗМЕНЕНИЕ ПАРОЛЯ
export async function updatePassword(newPassword: string): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(getUrl("/api/user/password"), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      password: newPassword,
    }),
  });

  await validateResponse(response);
}

// 7. МЕТОД ДЛЯ МГНОВЕННОЙ СМЕНЫ АВАТАРКИ
export async function uploadAvatar(formData: FormData): Promise<User> {
  return updateProfile(formData);
}