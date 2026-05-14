import { validateResponse } from "./validateResponse";
import { TokenSchema, TokenResponse, UserSchema, User } from "../schemas/userSchema";


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
  
  return result;
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


// ОБНОВЛЕНИЕ ДАННЫХ ПРОФИЛЯ
export async function updateProfile(formData: FormData): Promise<User> {
  const token = localStorage.getItem("token");

  const response = await fetch(`/api/user`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });

  // Если сервер вернет ошибку (например, 400), validateResponse прервет выполнение
  const validatedRes = await validateResponse(response);
  const data = await validatedRes.json();

  // Валидируем обновленные данные через нашу схему
  return UserSchema.parse(data);
}

// --- ИЗМЕНЕНИЕ ПАРОЛЯ (PATCH /api/user/password) ---
export async function updatePassword(newPassword: string): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(`/api/user/password`, {
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