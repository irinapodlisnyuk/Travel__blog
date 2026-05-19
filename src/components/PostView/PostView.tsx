import { FC } from "react";
import styles from "./PostView.module.scss";
import Icon from "@/components/types/Icon";
import { BASE_URL } from "@/api/config";
import { PostViewProps } from "@/components/types/IPost";
import { CommentsView } from "../CommentsView/CommentsView";
import { useNavigate } from "react-router-dom";

export const PostView: FC<PostViewProps> = ({
  post,
  comments,
  onBackClick,
}) => {
  const photoUrl = post.photo.startsWith("http")
    ? post.photo
    : `${BASE_URL}${post.photo}`;

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleReviewClick = (id: number | string) => {
    if (!token) {
      navigate("/login");
    } else {

       navigate(`/posts/${id}/comment`); 
  }
  };

  return (
    <section className={styles.post}>
      <div className="container">
        <div className={styles.post__wrapper}>
          {/* Блок фотографии */}
          <div className={styles.post__photo}>
            <img
              src={photoUrl}
              alt={post.title}
              className={styles["post__photo-img"]}
            />
          </div>
          <div className={styles.post__intro}>
            {/* Информационный блок */}
            <div className={styles.post__info}>
              <h2 className={styles["post__info-title"]}>
                {post.title || "Без названия"}
              </h2>

              {/* Текст */}
              <div className={styles.post__description}>
                {post.description ? (
                  post.description.split("\n").map((paragraph, index) => {
                    if (!paragraph.trim()) return null;
                    return (
                      <p
                        key={index}
                        className={`${styles["post__description-text"]} ${styles["post__description-text--value"]}`}
                        style={{ marginBottom: "22px" }}
                      >
                        {paragraph}
                      </p>
                    );
                  })
                ) : (
                  <p
                    className={`${styles["post__description-text"]} ${styles["post__description-text--value"]}`}
                  >
                    Описание о путешествии отсутствует.
                  </p>
                )}
              </div>

              {/* БЛОК КОММЕНТАРИЕВ (ВЫВОДИМ ВНИЗУ СТРАНИЦЫ) */}
              <CommentsView comments={comments} />
            </div>

            {/* КНОПКИ */}
            <div className={styles["post__btn"]}>
              <button
                onClick={onBackClick}
                type="button"
                className={`${styles["post__back-btn"]} ${styles.btn}`}
              >
                <Icon name="back-icon" className={styles["post__back-icon"]} />
                Назад
              </button>
              <button
                type="button" // Меняем submit на button, так как это просто триггер действия
                className={`${styles["post__review-btn"]} ${styles["btn"] || ""}`}
                onClick={() => handleReviewClick(post.id)}
              >
                Ваше впечатление об этом месте
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
