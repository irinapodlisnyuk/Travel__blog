import { FC } from "react";
import styles from "./PostDetailView.module.scss"; // Локальные стили просмотра
import Icon from "@/components/types/Icon";
import { BASE_URL } from "@/api/config";
import { PostDetailViewProps } from "@/components/types/IPost";

export const PostDetailView: FC<PostDetailViewProps> = ({
  post,
  comments,
  onBackClick,
}) => {
  // Формируем полный URL для фотографии поста
  const photoUrl = post.photo.startsWith("http")
    ? post.photo
    : `${BASE_URL}${post.photo}`;

  return (
    <section className={styles.postView}>
      <div className="container">
        <div className={styles.postView__wrapper}>
          {/* Блок фотографии */}
          <div className={styles.postView__photo}>
            <div className={styles["postView__photo-container"]}>
              <div className={styles["postView__preview-wrapper"]}>
                <img
                  src={photoUrl}
                  alt={post.title}
                  className={styles["postView__preview-img"]}
                />
              </div>
            </div>
          </div>

          {/* Информационный блок */}
          <div className={styles.postView__info}>
            {/* Заголовок истории */}
            <div className={styles["postView__info-intro"]}>
              <h1 className={styles.postView__title}>
                {post.title || "Без названия"}
              </h1>
            </div>

            {/* Текст самого рассказа разбитый по абзацам */}
            <div className={styles.postView__description}>
              {post.description ? (
                post.description.split("\n").map((paragraph, index) => {
                  if (!paragraph.trim()) return null;
                  return (
                    <p
                      key={index}
                      className={`${styles.postView__value} ${styles["postView__value--text"]}`}
                      style={{ marginBottom: "12px" }}
                    >
                      {paragraph}
                    </p>
                  );
                })
              ) : (
                <p
                  className={`${styles.postView__value} ${styles["postView__value--text"]}`}
                >
                  Описание о путешествии отсутствует.
                </p>
              )}
            </div>

            {/* БЛОК КОММЕНТАРИЕВ (ВЫВОДИМ ВНИЗУ СТРАНИЦЫ) */}
            <div className={styles.postView__comments}>
              <h3 className={styles["postView__comments-title"]}>
                Отзывы и впечатления ({comments.length})
              </h3>

              {comments.length === 0 ? (
                <p className={styles["postView__no-comments"]}>
                  У этой истории пока нет комментариев. Поделитесь своим мнением
                  первым!
                </p>
              ) : (
                <div className={styles["postView__comments-list"]}>
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={styles["postView__comment-item"]}
                    >
                      <div className={styles["postView__comment-header"]}>
                        <span className={styles["postView__comment-author"]}>
                          {comment.author_name}
                        </span>
                        <span className={styles["postView__comment-date"]}>
                          {new Date(comment.created_at).toLocaleDateString(
                            "ru-RU",
                          )}
                        </span>
                      </div>
                      <p className={styles["postView__comment-text"]}>
                        {comment.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* КНОПКИ ОТПРАВКИ */}
            <div className={styles["form-post__btn"]}>
              <button
                onClick={onBackClick}
                type="button"
                className={`${styles["form-post__back-btn"]} ${styles.btn}`}
              >
                <Icon
                  name="back-icon"
                  className={styles["form-post__save-icon"]}
                />
                Назад
              </button>

              <button
                type="submit"
                className={`${styles["form-post__save-btn"]} ${styles["btn"] || ""}`}
              ></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
