import { z } from "zod";

export const CreateCommentSchema = z.object({
  full_name: z.string().min(2, "Имя слишком короткое"),
  comment: z.string().min(1, "Комментарий не может быть пустым").max(500, "Максимум 500 символов"),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;