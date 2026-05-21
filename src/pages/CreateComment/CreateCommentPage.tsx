import { FC } from "react";
import { CreateCommentForm } from "@/components/Form/CreateCommentForm/CreateCommentForm";
import styles from "./CreateComment.module.scss"; 

export const CreateCommentPage: FC = () => {
  const token = localStorage.getItem("token") || "";
  const storedName = localStorage.getItem("userName") || "Путешественник";

  return (
    <section className={styles["create-comment"]}>
      <div className="container">
        <div className={styles["create-comment__wrapper"]}>
          <h2 className={styles["create-comment__title"]}>Добавление отзыва</h2>

          <CreateCommentForm token={token} userFullName={storedName} />
        </div>
      </div>
    </section>
  );
};