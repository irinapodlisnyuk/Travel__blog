import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { CreateCommentForm } from "./CreateCommentForm";
import { addCommentToPost } from "@/api/CommentsApi";

// 1. Мокаем роутинг
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "123" }),
  useNavigate: () => mockNavigate,
}));

// 2. Мокаем API-запрос
vi.mock("@/api/CommentsApi", () => ({
  addCommentToPost: vi.fn(),
}));

describe("CreateCommentForm", () => {
  const defaultProps = {
    token: "test-token",
    userFullName: "Иван Иванов",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("должен корректно рендерить форму с дефолтными значениями", () => {
    render(<CreateCommentForm {...defaultProps} />);

    // Поиск по placeholder для имени
    const nameInput = screen.getByPlaceholderText("Ваше имя") as HTMLInputElement;
    expect(nameInput).toBeInTheDocument();
    expect(nameInput.value).toBe(defaultProps.userFullName);

    // Поиск по placeholder для отзыва
    const textarea = screen.getByPlaceholderText("Добавьте текст отзыва") as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toBe("");

    // Проверяем счетчик символов
    expect(screen.getByText("0 / 600")).toBeInTheDocument();
  });

  it("должен обновлять счетчик символов при вводе текста", async () => {
    render(<CreateCommentForm {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("Добавьте текст отзыва");

    await userEvent.type(textarea, "Привет");

    expect(screen.getByText("6 / 600")).toBeInTheDocument();
  });

  it("должен успешно отправлять форму и очищать текстовое поле", async () => {
    // Избегаем конфликтов типов с помощью any
    vi.mocked(addCommentToPost).mockResolvedValueOnce({} as any);

    render(<CreateCommentForm {...defaultProps} />);
    
    const textarea = screen.getByPlaceholderText("Добавьте текст отзыва");
    const submitButton = screen.getByRole("button", { name: /сохранить/i });

    // Имитируем действия пользователя
    await userEvent.type(textarea, "Отличный пост!");
    await userEvent.click(submitButton);

    // Проверяем вызов API функции
    expect(addCommentToPost).toHaveBeenCalledWith({
      postId: "123",
      token: "test-token",
      data: {
        full_name: "Иван Иванов",
        comment: "Отличный пост!",
      },
    });

    // Ожидаем появление текста об успехе в модалке
    await waitFor(() => {
      expect(screen.getByText("Ваш отзыв успешно добавлен")).toBeInTheDocument();
    });

    // Проверяем, что поле textarea очистилось
    expect((textarea as HTMLTextAreaElement).value).toBe("");
  });
});
