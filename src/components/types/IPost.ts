import { ICommentExtended } from "./IComment";
import { IUserInfo } from "./IUserInfo";

export interface IPost {
  id: number;
  title: string;
  excerpt: string;
  counry: string;
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
  onSuccess?: (postId: number) => void;
}

export interface PostViewProps {
  post: IPostView;
  comments: ICommentExtended[];
  onBackClick: () => void;
}


export interface IFullPost {
  id: number;
  title: string;
  description: string;
  country: string; 
  city: string;   
  photo: string;
  comments: {
    author_name: string;
    comment: string;
    created_at: string;
  }[];
  userInfo: {
    full_name: string;
    city: string;
    bio: string;
  };
}