import { z } from "zod";

export const CreateCommentSchema = z.object({
  full_name: z.string().min(2, "Напишите имя"),
  comment: z.string().min(1, "Добавьте текст отзыва ").max(600, "Максимум 600 символов"),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;