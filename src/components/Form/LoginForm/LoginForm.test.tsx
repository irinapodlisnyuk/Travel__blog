import { render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { vi, describe, it, expect, beforeEach, afterEach  } from "vitest";
import { LoginForm } from "./LoginForm";
import { loginUser, fetchMe } from "../../../api/User";

// 1. Мокаем react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// 2. Мокаем API-запросы
vi.mock("../../../api/User", () => ({
  loginUser: vi.fn(),
  fetchMe: vi.fn(),
}));

// 3. Мокаем window.location.reload
const originalLocation = window.location;
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();

  // Создаем безопасный шпион для перезагрузки страницы
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { reload: vi.fn() },
  });
});

afterEach(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: originalLocation,
  });
});

describe("LoginForm", () => {
  it("должен корректно рендерить поля формы и кнопки", () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Пароль")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /войти/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /зарегистрироваться/i }),
    ).toBeInTheDocument();
  });

  it("должен перенаправлять на страницу регистрации при клике", async () => {
    render(<LoginForm />);

    const registerButton = screen.getByRole("button", {
      name: /зарегистрироваться/i,
    });
    await userEvent.click(registerButton);

    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });

  it("должен сохранять данные в localStorage и перезагружать страницу при успешном логине", async () => {
    // Настраиваем успешные ответы от API функций
    vi.mocked(loginUser).mockResolvedValueOnce({ token: "fake-jwt-token" });
    vi.mocked(fetchMe).mockResolvedValueOnce({
      full_name: "Петр Петров",
      photo: "avatar.png",
    }as any);

    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Пароль");
    const submitButton = screen.getByRole("button", { name: /войти/i });

    // Заполняем форму
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "secret123");
    await userEvent.click(submitButton);

    // Проверяем, что функции API вызвались с верными параметрами
    expect(loginUser).toHaveBeenCalledWith("test@example.com", "secret123");

    // Ждем выполнения асинхронных операций записи в localStorage и редиректа
    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("fake-jwt-token");
      expect(localStorage.getItem("userName")).toBe("Петр Петров");
      expect(localStorage.getItem("userPhoto")).toBe("avatar.png");
    });

    // Проверяем редирект в профиль
    expect(mockNavigate).toHaveBeenCalledWith("/profile", {
      state: { openEdit: false },
    });

    // Проверяем триггер перезагрузки страницы
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  it("должен отображать ошибку при неверных учетных данных", async () => {
    // Имитируем ошибку сервера
    vi.mocked(loginUser).mockRejectedValueOnce(new Error("Unauthorized"));

    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Пароль");
    const submitButton = screen.getByRole("button", { name: /войти/i });

    await userEvent.type(emailInput, "wrong@example.com");
    await userEvent.type(passwordInput, "wrongpass");
    await userEvent.click(submitButton);

    // Ожидаем появление текста ошибки на экране
    const errorMessage = await screen.findByText(
      "Неправильный логин или пароль",
    );
    expect(errorMessage).toBeInTheDocument();

    // Проверяем, что fetchMe НЕ вызывался
    expect(fetchMe).not.toHaveBeenCalled();
  });
});

