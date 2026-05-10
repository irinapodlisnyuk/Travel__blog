import { IPost } from '@/components/types/IPost';

export const getPosts = async (): Promise<IPost[]> => {
  const response = await fetch('/api/posts');
  
  if (!response.ok) {
    throw new Error('Не удалось загрузить истории');
  }
  
  return await response.json();
};