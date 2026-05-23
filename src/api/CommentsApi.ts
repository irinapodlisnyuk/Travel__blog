import { BASE_URL } from "./config";
import { validateResponse } from "./validateResponse";
import { AddCommentArgs, ICommentExtended } from "@/components/types/IComment";

export const getPostComments = async (id: string | number): Promise<ICommentExtended[]> => {
  const response = await fetch(`${BASE_URL}/api/posts/${id}/comments`);
  
  const validResponse = await validateResponse(response);
  
  return await validResponse.json();
};

export const addCommentToPost = async ({ postId, data, token }: AddCommentArgs): Promise<ICommentExtended> => {
  const response = await fetch(`${BASE_URL}/api/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const validResponse = await validateResponse(response);

  return await validResponse.json();
};