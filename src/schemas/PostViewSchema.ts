import { z } from "zod";


export const CommentSchema = z.object({
  author_name: z.string(),
  comment: z.string(),
  created_at: z.string(),
});

export const PostViewSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  country: z.string(),
  city: z.string(),
  photo: z.string(),
  comments: z.array(CommentSchema), // Валидируем массив комментариев
  userInfo: z.object({
    full_name: z.string(),
    city: z.string(),
    bio: z.string(),
  }),
});

export type PostDetail = z.infer<typeof PostViewSchema>;