import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { CreatePostForm } from "./CreatePostForm";
import { createPostFetch } from "@/api/PostsApi"; // Подставьте ваш точный путь к API

// 1. Мокаем роутинг
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// 2. Мокаем API функцию создания поста
vi.mock("@/api/PostsApi", () => ({
  createPostFetch: vi.fn(),
}));


 vi.mock("@/components/ModalOpen/ModalOpen", () => ({
  ModalOpen: ({ isOpen, onClose, text }: any) => (
    isOpen ? (
      <div data-testid="mock-modal">
        <p>{text}</p>
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null
  )
}));

describe("CreatePostForm", () => {
  const defaultProps = {
    token: "test-post-token",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("должен корректно рендерить все поля формы создания поста", () => {
    render(<CreatePostForm {...defaultProps} />);

    expect(screen.getByText("Загрузите ваше фото")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Заголовок")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Страна")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Город")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Добавьте описание вашей истории")).toBeInTheDocument();
    expect(screen.getByText("0 / 2000")).toBeInTheDocument();
  });

   it("должен обрабатывать загрузку файла и отображать его имя", async () => {
    render(<CreatePostForm {...defaultProps} />);

    // Создаем искусственный файл изображения
    const file = new File(["hello"], "trip.png", { type: "image/png" });
    
    // Ищем скрытый инпут по его ID, который привязан к лейблу
    const fileInput = screen.getByLabelText("Загрузите ваше фото");

    // Имитируем загрузку файла пользователем
    await userEvent.upload(fileInput, file);

    // Проверяем, что текст изменился и имя отобразилось
    expect(screen.getByText("Сменить фото")).toBeInTheDocument();
    expect(screen.getByText("trip.png")).toBeInTheDocument();
  });

   it("должен отправлять данные на сервер и перенаправлять на созданный пост", async () => {
    // Мокаем успешный ответ сервера с ID созданного поста
    vi.mocked(createPostFetch).mockResolvedValueOnce({ id: 999 }as any);

    render(<CreatePostForm {...defaultProps} />);

    // Находим элементы формы
    const fileInput = screen.getByLabelText("Загрузите ваше фото");
    const titleInput = screen.getByPlaceholderText("Заголовок");
    const countryInput = screen.getByPlaceholderText("Страна");
    const cityInput = screen.getByPlaceholderText("Город");
    const descriptionInput = screen.getByPlaceholderText("Добавьте описание вашей истории");
    const submitButton = screen.getByRole("button", { name: /сохранить/i });

    // Заполняем форму действиями пользователя
    const file = new File(["content"], "vacation.jpg", { type: "image/jpeg" });
    await userEvent.upload(fileInput, file);
    await userEvent.type(titleInput, "Мой отпуск");
    await userEvent.type(countryInput, "Италия");
    await userEvent.type(cityInput, "Рим");
    await userEvent.type(descriptionInput, "Это была незабываемая поездка...");

    // Отправляем форму
    await userEvent.click(submitButton);

    // Проверяем, что fetch-функция получила верные аргументы
    expect(createPostFetch).toHaveBeenCalledWith(
      {
        title: "Мой отпуск",
        country: "Италия",
        city: "Рим",
        description: "Это была незабываемая поездка...",
        photo: file,
      },
      "test-post-token"
    );

    // Ожидаем появление всплывающего окна успеха
    await waitFor(() => {
      expect(screen.getByText("Ваша история успешно добавлена")).toBeInTheDocument();
    });

      const closeModalButton = screen.getByRole("button", { name: "Close Modal" });
    await userEvent.click(closeModalButton); 



    expect(mockNavigate).toHaveBeenCalledWith("/posts/999");
  });
});