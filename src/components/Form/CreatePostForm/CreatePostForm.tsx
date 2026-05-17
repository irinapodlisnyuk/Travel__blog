import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormField } from "../FormField/FormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostFetch } from "@/api/PostsApi"; // Скорректируйте путь к API постов
import { CreatePostSchema, CreatePostInput } from "@/schemas/CreatePostSchema"; // Ваша Zod-схема
import styles from "./CreatePostForm.module.scss";
import customStyles from "../LoginForm/custom-login.module.scss";
import { CreatePostFormProps } from "@/components/types/IPost";

export const CreatePostForm: FC<CreatePostFormProps> = ({ token }) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreatePostInput>({
    resolver: zodResolver(CreatePostSchema),
  });

  const selectedPhoto = watch("photo");

  const onSubmit = async (data: CreatePostInput) => {
    setServerError(null);
    try {
      await createPostFetch(data, token);
      alert("Пост успешно создан!");

      // Очистка формы и URL-превью
      reset();
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      // Перенаправляем пользователя на главную страницу со списком всех историй
      navigate("/");
    } catch (error: any) {
      setServerError(error.message || "Произошла ошибка при создании поста");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("photo", file, { shouldValidate: true });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className={styles["post-form-container"]}>
      {serverError && (
        <div className={styles["server-error"]}>{serverError}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* ЗАГОЛОВОК */}
        <FormField label="Заголовок" errorMessage={errors.title?.message}>
          <input
            type="text"
            {...register("title")}
            placeholder="Введите заголовок (до 255 символов)"
            className={styles.input}
          />
        </FormField>

        {/* СТРАНА */}
        <FormField label="Страна" errorMessage={errors.country?.message}>
          <input
            type="text"
            {...register("country")}
            placeholder="Например: Казахстан"
            className={styles.input}
          />
        </FormField>

        {/* ГОРОД */}
        <FormField label="Город" errorMessage={errors.city?.message}>
          <input
            type="text"
            {...register("city")}
            placeholder="Например: Астана"
            className={styles.input}
          />
        </FormField>

        {/* ОПИСАНИЕ */}
        <FormField label="Описание" errorMessage={errors.description?.message}>
          <textarea
            {...register("description")}
            placeholder="Расскажите о вашем путешествии (до 2 000 символов)"
            rows={8}
            className={styles.textarea}
          />
        </FormField>

        {/* ФОТОГРАФИЯ */}
        <FormField
          label="Фотография (только JPEG или PNG)"
          errorMessage={errors.photo?.message}
        >
          <div className={styles["file-input-wrapper"]}>
            <input
              id="photo-upload"
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
              className={styles["hidden-file-input"]}
            />
            <label htmlFor="photo-upload" className={styles["file-button"]}>
              {selectedPhoto ? "Сменить фото" : "Загрузить файл"}
            </label>
            {selectedPhoto && (
              <span className={styles["file-name"]}>{selectedPhoto.name}</span>
            )}
          </div>

          {previewUrl && (
            <div className={styles["image-preview-container"]}>
              <img
                src={previewUrl}
                alt="Превью"
                className={styles["image-preview"]}
              />
            </div>
          )}
        </FormField>

        {/* КНОПКА ОТПРАВКИ */}
        <div className={styles["profile__btn"]}>
          <button
            type="button"
            className={`${styles["profile__save-btn"]} ${styles.btn}`}
            disabled={isSubmitting}
            onClick={() => navigate(-1)}
          >
            Назад
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`${styles["submit-btn"]} ${customStyles["btn"] || ""}`}
          >
            {isSubmitting ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </form>
    </div>
  );
};
