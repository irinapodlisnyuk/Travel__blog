import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormField } from "../FormField/FormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostFetch } from "@/api/PostsApi";
import { CreatePostSchema, CreatePostInput } from "@/schemas/CreatePostSchema";
import styles from "./CreatePostForm.module.scss";
import customStyles from "../LoginForm/Custom-login.module.scss";
import { CreatePostFormProps } from "@/components/types/IPost";
import Icon from "@/components/types/Icon";
import { ModalOpen } from "@/components/ModalOpen/ModalOpen";
import { ButtonForm } from "../ButtonForm/ButtonForm";

export const CreatePostForm: FC<CreatePostFormProps> = ({ token }) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdPostId, setCreatedPostId] = useState<number | null>(null);

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
  const descriptionValue = watch("description") || "";

  const getInputClass = (fieldName: keyof CreatePostInput) =>
    `${customStyles["custom__input"]} ${errors[fieldName] ? customStyles["custom__input--error"] : ""}`;

  const onSubmit = async (data: CreatePostInput) => {
    setServerError(null);
    try {
      const res = await createPostFetch(data, token);

      if (res && res.id) {
        setCreatedPostId(res.id);
      }

      setIsSuccessModalOpen(true);
      reset();
    } catch (error: any) {
      setServerError(error.message || "Произошла ошибка при создании поста");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("photo", file, { shouldValidate: true });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles["form-post"]}>
        {serverError && (
          <div className={styles["server-error"]}>{serverError}</div>
        )}

        {/* ФОТОГРАФИЯ */}
        <FormField
          className={styles["form-post__field"]}
          errorMessage={errors.photo?.message}
        >
          <div
            className={`${styles["form-post__wrapper"]} ${errors.photo ? customStyles["custom__input--error"] : ""}`}
          >
            <Icon name="upload" className={styles["custom__input-icon"]} />
            <input
              id="photo-upload"
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <label
              htmlFor="photo-upload"
              className={styles["form-post__label"]}
            >
              {selectedPhoto ? "Сменить фото" : "Загрузите ваше фото"}
            </label>
          </div>
          {selectedPhoto && (
            <span className={styles["form-post__name-photo"]}>
              {selectedPhoto.name}
            </span>
          )}
        </FormField>

        {/* ЗАГОЛОВОК */}
        <FormField
          label="Заголовок"
          errorMessage={errors.title?.message}
          icon={<Icon name="icon-label" />}
        >
          <input
            type="text"
            {...register("title")}
            placeholder="Заголовок"
            className={getInputClass("title")}
          />
        </FormField>

        <div className={styles["form-post__container"]}>
          {/* СТРАНА */}
          <FormField
            label="Страна"
            errorMessage={errors.country?.message}
            icon={<Icon name="icon-label" />}
          >
            <input
              type="text"
              {...register("country")}
              placeholder="Страна"
              className={getInputClass("country")}
            />
          </FormField>

          {/* ГОРОД */}
          <FormField
            label="Город"
            errorMessage={errors.city?.message}
            icon={<Icon name="icon-label" />}
          >
            <input
              type="text"
              {...register("city")}
              placeholder="Город"
              className={getInputClass("city")}
            />
          </FormField>
        </div>

        {/* ОПИСАНИЕ */}
        <FormField
          label="Описание"
          errorMessage={errors.description?.message}
          icon={<Icon name="icon-label" />}
           className={styles["form-post__field--textarea"]}
        >
          <div className={styles["form-post__textarea"]}>
            <textarea
              {...register("description")}
              placeholder="Добавьте описание вашей истории"
              rows={8}
              //   className={getInputClass("description")}
              maxLength={2000}
              className={`${customStyles["custom__input"]} ${styles.textarea} ${
                errors.description ? styles.textareaError : ""
              }`}
            />
            <div className={styles["form-post__textarea-counter"]}>
              {descriptionValue.length} / 2000
            </div>
          </div>
        </FormField>

        {/* КНОПКИ ОТПРАВКИ */}
           <ButtonForm isSubmitting={isSubmitting}/>
      </form>

      <ModalOpen
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          if (createdPostId) {
            navigate(`/posts/${createdPostId}`);
          } else {
            navigate("/");
          }
        }}
        text="Ваша история успешно добавлена"
      />
    </>
  );
};
