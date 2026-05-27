import { IPost, IPostView } from "@/components/types/IPost";
import { validateResponse } from "./validateResponse";
import { CreatePostInput } from "@/schemas/CreatePostSchema";
import { BASE_URL } from "./config";

export const getPosts = async (): Promise<IPost[]> => {
  const response = await fetch('/api/posts');
  // const response = await fetch(`${BASE_URL}/api/posts`);

  if (!response.ok) {
    throw new Error("Не удалось загрузить истории");
  }

  return await response.json();
};

export const getPostById = async (id: string | number): Promise<IPostView> => {
  const response = await fetch(`${BASE_URL}/api/posts/${id}`);

  const validResponse = await validateResponse(response);

  return await validResponse.json();
};

// Функция отправки поста
export const createPostFetch = async (
  data: CreatePostInput,
  token: string,
): Promise<IPostView> => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("country", data.country);
  formData.append("city", data.city);
  formData.append("photo", data.photo);

  const response = await fetch("/api/posts", {
  // const response = await fetch(`${BASE_URL}/api/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const validResponse = await validateResponse(response);

  return validResponse.json();
};
