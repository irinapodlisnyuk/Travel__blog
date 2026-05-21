import { FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormField } from "../FormField/FormField";
import { ModalOpen } from "@/components/ModalOpen/ModalOpen";
import { addCommentToPost } from "@/api/CommentsApi";
import {
  CreateCommentSchema,
  CreateCommentInput,
} from "@/schemas/CreateCommentSchema"; 
import Icon from "@/components/types/Icon";

import styles from "./CreateCommentForm.module.scss";
import customStyles from "../LoginForm/custom-login.module.scss";
import { ButtonForm } from "../ButtonForm/ButtonForm";

interface CreateCommentFormProps {
  token: string;
  userFullName: string;
}

export const CreateCommentForm: FC<CreateCommentFormProps> = ({
  token,
  userFullName,
}) => {
  const { id: postId } = useParams<{ id: string }>(); // Автоматически забираем id поста из URL
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateCommentInput>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      full_name: userFullName,
      comment: "",
    },
  });

  const commentValue = watch("comment") || "";

  const getInputClass = (fieldName: keyof CreateCommentInput) =>
    `${customStyles["custom__input"]} ${errors[fieldName] ? customStyles["custom__input--error"] : ""}`;

  const onSubmit = async (data: CreateCommentInput) => {
    if (!postId) return;
    setServerError(null);

    try {
      // Отправляем JSON-комментарий на эндпоинт POST /api/posts/{id}/comments
      await addCommentToPost({ postId, data, token });

      setIsSuccessModalOpen(true);
      reset({ full_name: userFullName, comment: "" });
    } catch (error: any) {
      setServerError(error.message || "Произошла ошибка при создании отзыва");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-comment"]}
        noValidate
      >
        {serverError && (
          <div className={styles["server-error"]}>{serverError}</div>
        )}

        {/* ИМЯ АВТОРА */}
        <FormField
          label="Ваше имя"
          errorMessage={errors.full_name?.message}
          icon={<Icon name="icon-label" />}
        >
          <input
            type="text"
            {...register("full_name")}
            placeholder="Ваше имя"
            className={getInputClass("full_name")}
          />
        </FormField>

        {/* ТЕКСТ ОТЗЫВА */}
        <FormField
          label="Отзыв"
          errorMessage={errors.comment?.message}
          icon={<Icon name="icon-label" />}
          className={styles["form-comment__field--textarea"]}
        >
          <div className={styles["form-comment__textarea"]}>
            <textarea
              {...register("comment")}
              placeholder="Добавьте текст отзыва"
              rows={8}
              maxLength={600}
              className={`${customStyles["custom__input"]} ${styles.textarea} ${
                errors.comment ? styles.textareaError : ""
              }`}
            />
            <div className={styles["form-comment__textarea-counter"]}>
              {commentValue.length} / 600
            </div>
          </div>
        </FormField>

        {/* КНОПКИ УПРАВЛЕНИЯ */}
        <ButtonForm isSubmitting={isSubmitting} />
      </form>

      <ModalOpen
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          navigate(`/posts/${postId}`);
        }}
        text="Ваш отзыв успешно добавлен"
      />
    </>
  );
};
