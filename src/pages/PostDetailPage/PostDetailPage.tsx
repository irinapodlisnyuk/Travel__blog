import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById} from "@/api/PostsApi"; // Добавлен импорт функции комментариев
import { IPostView } from "@/components/types/IPost"; // Добавлен тип расширенных комментариев
import { PostDetailView } from "@/components/PostDetailView/PostDetailView";
import LoaderPage from "@/components/LoaderPage/LoaderPage";
import { ICommentExtended } from "@/components/types/IComment";
import { getPostComments } from "@/api/CommentsApi";

export const PostDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>(); // Вытаскиваем id из урла
  const navigate = useNavigate();
  
  const [post, setPost] = useState<IPostView | null>(null);
  const [comments, setComments] = useState<ICommentExtended[]>([]); // Добавлен стейт для комментариев
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);

    // Запрашиваем данные поста и комментарии параллельно
    Promise.all([getPostById(id), getPostComments(id)])
      .then(([postData, commentsData]) => {
        setPost(postData);
        setComments(commentsData);
      })
      .catch((err) => {
        setError(err.message || "Не удалось загрузить историю");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="container">
        <LoaderPage />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container" style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>История не найдена</h2>
        <p>{error}</p>
        <button className="btn" onClick={() => navigate("/")}>
          На главную
        </button>
      </div>
    );
  }

  // Исправлено: Добавлен обязательный оператор return
  return (
    <PostDetailView 
      post={post} 
      comments={comments} 
      onBackClick={() => navigate(-1)} 
    />
  );
}