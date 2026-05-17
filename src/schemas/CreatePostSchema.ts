import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z
    .string()
    .min(1, "Заголовок обязателен для заполнения")
    .max(255, "Заголовок не должен превышать 255 символов"),
    
  description: z
    .string()
    .min(1, "Описание обязательно для заполнения")
    .max(2000, "Описание не должно превышать 2000 символов"),
    
  country: z
    .string()
    .min(1, "Страна обязательна для заполнения")
    .max(255, "Название страны не должно превышать 255 символов"),
    
  city: z
    .string()
    .min(1, "Город обязателен для заполнения")
    .max(255, "Название города не должно превышать 255 символов"),
    
  // Валидация фотографии: проверяем строго JPEG и PNG
  photo: z
    .instanceof(File, { message: "Фотография обязательна для заполнения" })
    .refine(
      (file) => ["image/jpeg", "image/png"].includes(file.type),
      "Допустимы только форматы JPEG или PNG"
    )
    .refine(
      (file) => file.size <= 10 * 1024 * 1024, 
      "Размер файла слишком большой"
    ),
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;