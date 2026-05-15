import { FC } from "react";
import viewStyles from "./ProfileView.module.scss";
import Icon from "../types/Icon";
import { ProfilePhoto } from "./ProfilePhoto";
import { ProfileViewProps } from "../types/Profile";

export const ProfileView: FC<ProfileViewProps> = ({
  fullName,
  city,
  bio,
  photoPreview,
  setIsEditMode,
  styles,
  stylesForm,
  fileInputRef,
  handleFileChange,
  photoError,
  isLoading,
}) => {
  return (
    <section className={styles.profile}>
      <div className="container">
        <div className={stylesForm.form__profile}>

          <ProfilePhoto
            photoPreview={photoPreview}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            errorMessage={photoError}
            isLoading={isLoading}
          />

          <div
            className={`${styles.profile__info} ${viewStyles["view__info"]}`}
          >
            <div className={viewStyles["view__info-intro"]}>
              <p className={viewStyles.view__fullname}>
                {fullName || "Не указано"}
              </p>
              <div className={viewStyles.view__edit}>
                <button
                  type="button"
                  className={viewStyles["view__edit-btn"]}
                  onClick={() => setIsEditMode(true)}
                >
                  <Icon name="edit" className={viewStyles["view__edit-icon"]} />
                </button>
              </div>
            </div>

            <div className={viewStyles["view__info-wrapper"]}>
              <div className={viewStyles.view__city}>
                <span className={viewStyles["view__text"]}>Город</span>
                <p className={viewStyles["view__value"]}>
                  {city || "Не указан"}
                </p>
              </div>

              <div className={viewStyles.view__aboutMe}>
                <span className={viewStyles["view__text"]}>О себе</span>
                <p
                  className={`${viewStyles.view__value} ${viewStyles["view__value--bio"]}`}
                >
                  {bio || "Информация отсутствует"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
