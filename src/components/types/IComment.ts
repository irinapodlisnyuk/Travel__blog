import { CreateCommentInput } from "@/schemas/CreateCommentSchema";

export interface ICommentExtended  {
  id: number;
  post_id: number;  
  author_name: string;
  comment: string;
  created_at: string; 
}

export interface AddCommentArgs {
  postId: string | number;
  data: CreateCommentInput;
  token: string;
}
