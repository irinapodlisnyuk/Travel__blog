import { FC, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ProfileView } from "./ProfileView";
import { ProfilePhoto } from "./ProfilePhoto";
import { FormField } from "@/components/Form/FormField/FormField";
import Icon from "@/components/types/Icon";

import { ProfileLocation } from "../types/Profile";

import styles from "./ProfileEdit.module.scss";
import stylesForm from "./ProfileForm.module.scss";
import customStyles from "@/components/Form/LoginForm/custom-login.module.scss";
import { useProfileForm } from "@/hooks/useProfileForm";
import LoaderPage from "../LoaderPage/LoaderPage";

export const ProfileEdit: FC = () => {
  const { state, actions } = useProfileForm();
  const { photoPreview, errors, isLoading, isPageLoading, bioLength } = state;

  const {
    register,
    handleSubmit,
    onFormSubmit,
    handleFileChange,
    fileInputRef,
    resetForm,
    getValues,
  } = actions;

  const location = useLocation();
  const locationState = location.state as ProfileLocation | null;

  const [isEditMode, setIsEditMode] = useState(
    locationState?.openEdit === true,
  );

  useEffect(() => {
    if (locationState?.openEdit) {
      setIsEditMode(true);
    }
  }, [locationState?.openEdit]);

  if (isPageLoading) {
    return (
      <div className="container">
        <LoaderPage />
      </div>
    );
  }

  const hasAnyError = Object.keys(errors).length > 0;

  const getInputClass = (fieldName: string) =>
    `${customStyles["custom__input"]} ${errors[fieldName] ? customStyles["custom__input--error"] : ""}`;

  // РЕЖИМ ПРОСМОТРА
  if (!isEditMode) {
    const currentValues = getValues?.() || { fullName: "", city: "", bio: "" };

    return (
      <ProfileView
        fullName={currentValues.fullName}
        city={currentValues.city || ""}
        bio={currentValues.bio || ""}
        photoPreview={photoPreview}
        setIsEditMode={setIsEditMode}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        photoError={errors.photo}
        isLoading={isLoading}
        styles={styles}
        stylesForm={stylesForm}
      />
    );
  }

  return (
    <form
      className={stylesForm.form__profile}
      onSubmit={handleSubmit(async (data) => {
        // Этот коллбэк вызовется ТОЛЬКО если Zod-валидация прошла успешно
        const isSuccess = await onFormSubmit(data);

        if (isSuccess) {
          setIsEditMode(false);
        }
      })}
      noValidate
    >
      <ProfilePhoto
        photoPreview={photoPreview}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        errorMessage={errors.photo}
        isLoading={isLoading}
      />

      <div
        className={`${styles["profile__info"]} ${hasAnyError ? styles.hasError : ""}`}
      >
        <FormField
          className={styles["profile__info-field"]}
          label="ФИО *"
          errorMessage={errors.fullName}
          icon={<Icon name="icon-label" />}
        >
          <input
            type="text"
            className={getInputClass("fullName")}
            placeholder="Иванов Иван"
            {...register("fullName")}
          />
        </FormField>
        <FormField
          className={styles["profile__info-field"]}
          label="Город"
          errorMessage={errors.city}
          icon={<Icon name="icon-label" />}
        >
          <input
            type="text"
            className={getInputClass("city")}
            placeholder="Москва"
            {...register("city")}
          />
        </FormField>
        <FormField
          className={styles["profile__info-field"]}
          label="О себе"
          errorMessage={errors.bio}
        >
          <div className={styles["profile__textarea"]}>
            <textarea
              className={getInputClass("bio")}
              placeholder="Краткое описание"
              maxLength={600}
              style={{ resize: "vertical", minHeight: "137px" }}
              {...register("bio")}
            />
            <div className={styles["profile__textarea-counter"]}>
              {bioLength} / 600
            </div>
          </div>
        </FormField>
        <div className={styles["profile__password"]}>
          <p className={styles["profile__password-title"]}>Смена пароля</p>
          <div className={styles["profile__password-wrapper"]}>
            <FormField
              className={styles["profile__info-field"]}
              label="Новый пароль"
              errorMessage={errors.newPassword}
              icon={<Icon name="icon-label" />}
            >
              <input
                type="password"
                className={getInputClass("newPassword")}
                placeholder="Новый пароль"
                {...register("newPassword")}
              />
            </FormField>

            <FormField
              className={styles["profile__info-field"]}
              label="Повторите пароль"
              errorMessage={errors.repeatPassword}
              icon={<Icon name="icon-label" />}
            >
              <input
                type="password"
                className={getInputClass("repeatPassword")}
                placeholder="Повторите пароль"
                {...register("repeatPassword")}
              />
            </FormField>
          </div>

          {errors.server && (
            <p className={styles["profile__error-server"]}>{errors.server}</p>
          )}
        </div>
        <div className={styles["profile__btn"]}>
          <button
            type="button"
            className={`${styles["profile__save-btn"]} ${styles.btn}`}
            disabled={isLoading}
            onClick={() => {
              resetForm();
              setIsEditMode(false);
            }}
          >
            Назад
          </button>

          <button
            type="submit"
            className={`${styles["profile__back-btn"]} ${styles.btn}`}
            disabled={isLoading}
          >
            {isLoading ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    </form>
  );
};
