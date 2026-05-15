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

export const ProfileEdit: FC = () => {
  const { state, actions } = useProfileForm();

  const location = useLocation();
  const locationState = location.state as ProfileLocation | null;

  const [isEditMode, setIsEditMode] = useState(
    locationState?.openEdit === true,
  );

  useEffect(() => {
    if (location.state?.openEdit) {
      setIsEditMode(false);
    }
  }, [location]);

  const {
    fullName,
    city,
    bio,
    photoPreview,
    newPassword,
    repeatPassword,
    errors,
    isLoading,
    isPageLoading,
  } = state;
  const {
    setFullName,
    setCity,
    setBio,
    setNewPassword,
    setRepeatPassword,
    handleFileChange,
    handleSubmit,
    fileInputRef,
    resetForm,
  } = actions;

  if (isPageLoading) {
    return <div className="container">Загрузка профиля...</div>;
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isSuccess = await handleSubmit(e);

    if (isSuccess) {
      setIsEditMode(false);
    }
  };
  const hasAnyError = Object.keys(errors).length > 0;
  const getInputClass = (fieldName: string) =>
    `${customStyles["custom__input"]} ${errors[fieldName] ? customStyles["custom__input--error"] : ""}`;

  if (!isEditMode) {
    return (
      <ProfileView
        fullName={fullName}
        city={city}
        bio={bio}
        photoPreview={photoPreview}
        setIsEditMode={setIsEditMode}
        styles={styles}
        stylesForm={stylesForm}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        photoError={errors.photo}
        isLoading={isLoading}
      />
    );
  }

  return (
    <section className={styles.profile}>
      <div className="container">
        <form
          className={stylesForm.form__profile}
          onSubmit={handleFormSubmit}
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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
                value={city}
                onChange={(e) => setCity(e.target.value)}
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
                  value={bio}
                  maxLength={600}
                  onChange={(e) => setBio(e.target.value)}
                  style={{ resize: "vertical", minHeight: "137px" }}
                />
                <div className={styles["profile__textarea-counter"]}>
                  {bio.length} / 600
                </div>
              </div>
            </FormField>

            {/* Блок смены паролей (допишите инпуты сюда) */}
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
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </FormField>
              </div>

              {errors.server && (
                <p className={styles["profile__error-server"]}>
                  {errors.server}
                </p>
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
                className={`${styles["profile__back-btn"]}  ${styles.btn}`}
                disabled={isLoading}
              >
                {isLoading ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
