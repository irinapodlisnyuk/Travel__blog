import { FC } from "react";
import styles from "./CommentsView.module.scss";
import { ICommentExtended } from "../types/IComment";

interface CommentsViewProps {
  comments: ICommentExtended[];
}

export const CommentsView: FC<CommentsViewProps> = ({ comments = [] }) => {
  return (
    <>
      <div className={styles.comments}>
        {comments.length === 0 ? (
          <p className={styles["comments__text"]}>
            У этой истории пока нет комментариев. Поделитесь своим мнением
            первым!
          </p>
        ) : (
          <div className={styles["comments__list"]}>
            {comments.map((comment) => (
              <div
                key={comment.id} 
                className={styles["comment__item"]}
              >
                <div className={styles["comment__header"]}>
                  <span className={styles["comment__header-author"]}>
                    {comment.author_name}
                  </span>
                  <span className={styles["comment__header-date"]}>
                    {comment.created_at
                      ? new Date(comment.created_at).toLocaleDateString("ru-RU")
                      : ""}
                  </span>
                </div>
                <p className={styles["comments__text"]}>
                  {comment.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
