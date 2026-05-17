import { FC } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreatePostPage.module.scss"; 
import { CreatePostForm } from "@/components/Form/CreatePostForm/CreatePostForm";

export const CreatePostPage: FC = () => {
  const navigate = useNavigate();


  const handleCreatePost = (postId: number) => {
    console.log(`Пост успешно создан с ID: ${postId}`);
    
    navigate(`/posts/${postId}`); 
  };

  // Получаем токен из localStorage для авторизованного запроса
  const token = localStorage.getItem("token") || "";

  return (
    <section className={styles.post}>
      <div className="container">
        <div className={styles["post__wrapper"]}>
          <h2 className={styles["post__title"]}>Добавление истории о&nbsp;путешествии</h2>
          
          <CreatePostForm token={token} onSuccess={handleCreatePost} />
        </div>
      </div>
    </section>
  );
};