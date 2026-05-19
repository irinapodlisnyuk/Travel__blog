import { ICommentExtended } from "./IComment";
import { IUserInfo } from "./IUserInfo";

export interface IPost {
  id: number;
  title: string;
  excerpt: string;
  country: string;
  city: string;
  photo: string;
}

export interface IComment {
  author_name: string;
  comment: string;
  created_at: string;
}

export interface IPostView {
  id: number;
  title: string;
  description: string;
  country: string;
  city: string;
  photo: string;
  comments: IComment[];
  userInfo: IUserInfo;
}

export interface CreatePostFormProps {
  token: string;
  onSuccess?: (postId: number) => void; // Добавляем коллбэк, принимающий числовой ID
}

// Описываем типы пропсов прямо здесь для 100% надежности TypeScript
export interface PostDetailViewProps {
  post: IPostView;
  comments: ICommentExtended[]; // Добавляем массив комментариев с бэка
  onBackClick: () => void;
}
