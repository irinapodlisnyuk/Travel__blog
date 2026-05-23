import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { RegisterForm } from "./RegisterForm";
import { registerUser } from "../../../api/User"; // Подставьте ваш точный путь к API

// 1. Мокаем роутинг
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// 2. Мокаем API функцию регистрации
vi.mock("../../../api/User", () => ({
  registerUser: vi.fn(),
}));

describe("RegisterForm", () => {
  const defaultProps = {
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("должен корректно рендерить поля формы и кнопки", () => {
    render(<RegisterForm />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Пароль")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Подтвердите пароль"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /зарегистрироваться/i }),
    ).toBeInTheDocument();
  });

    it("должен успешно регистрировать пользователя, вызывать onSuccess и делать редирект", async () => {
    // Настраиваем успешный ответ сервера с токеном
    vi.mocked(registerUser).mockResolvedValueOnce({ token: "register-jwt-token" });

    render(<RegisterForm {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Пароль");
    const confirmPasswordInput = screen.getByPlaceholderText("Подтвердите пароль");
    const submitButton = screen.getByRole("button", { name: /зарегистрироваться/i });

    // Имитируем ввод данных пользователем
    await userEvent.type(emailInput, "newuser@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.type(confirmPasswordInput, "password123");
    await userEvent.click(submitButton);

    // Проверяем вызов API с нужными аргументами
    expect(registerUser).toHaveBeenCalledWith("newuser@example.com", "password123");

    // Проверяем сохранение токена в localStorage
    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("register-jwt-token");
    });

    // Проверяем вызов пропса onSuccess
    expect(defaultProps.onSuccess).toHaveBeenCalledTimes(1);

    // Проверяем редирект на страницу профиля с флагом открытия редактирования
    expect(mockNavigate).toHaveBeenCalledWith("/profile", { state: { openEdit: true } });
  });

   it("должен корректно обрабатывать ошибку, если email уже занят", async () => {
    // Имитируем структуру ошибки Axios/Fetch от бэкенда
    const serverErrorResponse = {
      response: {
        data: {
          message: "User with this email already exists"
        }
      }
    };
    vi.mocked(registerUser).mockRejectedValueOnce(serverErrorResponse);

    render(<RegisterForm {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Пароль");
    const confirmPasswordInput = screen.getByPlaceholderText("Подтвердите пароль");
    const submitButton = screen.getByRole("button", { name: /зарегистрироваться/i });

    await userEvent.type(emailInput, "existing@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.type(confirmPasswordInput, "password123");
    await userEvent.click(submitButton);

    // Текст ошибки "Аккаунт с данным email уже существует" передается в FormField.
    // Так как он не содержит слово "email", он отрендерится внутри FormField (который мы ищем по тексту ошибки)
    const errorText = await screen.findByText("Аккаунт с данным email уже существует");
    expect(errorText).toBeInTheDocument();

    // Проверяем, что onSuccess НЕ вызывался и редиректа НЕ было
    expect(defaultProps.onSuccess).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
