// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import { LoginForm } from "./LoginForm";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { loginUser } from "../../../api/User";
// import "@testing-library/jest-dom";

// // 1. Мокаем функцию API
// jest.mock("../../../api/User", () => ({
//   loginUser: jest.fn(),
// }));

// // 2. Создаем чистый QueryClient для тестов
// const createTestQueryClient = () =>
//   new QueryClient({
//     defaultOptions: {
//       queries: { retry: false },
//       mutations: { retry: false },
//     },
//   });

// describe("LoginForm Component", () => {
//   let queryClient: QueryClient;

//   beforeEach(() => {
//     queryClient = createTestQueryClient();
//     jest.clearAllMocks();
//   });

//   const setup = () =>
//     render(
//       <QueryClientProvider client={queryClient}>
//         <LoginForm />
//       </QueryClientProvider>,
//     );

//   test("должен обновлять поля ввода email и password", () => {
//     setup();
//     const emailInput = screen.getByPlaceholderText(
//       /электронная почта/i,
//     ) as HTMLInputElement;
//     const passwordInput = screen.getByPlaceholderText(
//       /пароль/i,
//     ) as HTMLInputElement;

//     fireEvent.change(emailInput, { target: { value: "test@test.com" } });
//     fireEvent.change(passwordInput, { target: { value: "123456" } });

//     expect(emailInput.value).toBe("test@test.com");
//     expect(passwordInput.value).toBe("123456");
//   });

//   test("должен вызывать loginUser при отправке формы", async () => {
//     (loginUser as jest.Mock).mockResolvedValue({
//       id: "1",
//       email: "test@test.com",
//     });
//     setup();

//     fireEvent.change(screen.getByPlaceholderText(/электронная почта/i), {
//       target: { value: "user@mail.ru" },
//     });
//     fireEvent.change(screen.getByPlaceholderText(/пароль/i), {
//       target: { value: "password123" },
//     });

//     fireEvent.submit(screen.getByRole("button", { name: /войти/i }));

//     await waitFor(() => {
//       expect(loginUser).toHaveBeenCalledWith("user@mail.ru", "password123");
//     });
//   });

//   test("должен показывать состояние загрузки в кнопке", async () => {
//     // Имитируем долгий ответ
//     (loginUser as jest.Mock).mockReturnValue(
//       new Promise((resolve) => setTimeout(resolve, 100)),
//     );
//     setup();

//     fireEvent.submit(screen.getByRole("button", { name: /войти/i }));

//     // Ждем, пока React увидит изменение стейта и заблокирует кнопку
//     await waitFor(() => {
//       const button = screen.getByRole("button", { name: /войти/i });
//       expect(button).toBeDisabled();
//     });
//   });

//   test("должен добавлять класс ошибки при неудачном входе", async () => {
//     (loginUser as jest.Mock).mockRejectedValue(new Error("Unauthorized"));
//     setup();

//     fireEvent.submit(screen.getByRole("button", { name: /войти/i }));

//     await waitFor(() => {
 
//       const emailField = screen
//         .getByPlaceholderText(/электронная почта/i)
//         .closest(".form-field");

//       expect(emailField).not.toBeNull(); // На всякий случай проверим, что нашли элемент
//       expect(emailField).toHaveClass("error-message__login");
//     });
//   });
// });
