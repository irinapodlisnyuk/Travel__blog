// components/Profile/ProfilePhoto.tsx
import styles from "./ProfileEdit.module.scss";
import React, { memo } from "react";
import Icon from "../types/Icon";
import { FormField } from "../Form/FormField";
import { ProfilePhotoProps } from "../types/Profile";

export const ProfilePhoto = memo(
  ({
    photoPreview,
    fileInputRef,
    handleFileChange,
    errorMessage,
    isLoading,
  }: ProfilePhotoProps) => {
    const handleButtonClick = (e: React.MouseEvent) => {
      e.preventDefault();
      fileInputRef.current?.click();
    };

    return (
      <div className={styles.profile__photo}>
        <FormField
          className={styles["profile__photo-field"]}
          errorMessage={errorMessage}
        >
          <div className={styles["profile__photo-container"]}>
            <div className={styles["profile__preview-wrapper"]}>
              <img
                src={photoPreview || "/images/avatar.jpg"}
                alt="Превью"
                className={styles["profile__preview-img"]}
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div className={styles["profile__add"]}>
              <Icon className={styles["profile__add-icon"]} name="photo" />
              <button
                type="button"
                className={styles["profile__add-btn"]}
                onClick={handleButtonClick}
                disabled={isLoading}
              >
                Изменить фото
              </button>
            </div>
          </div>
        </FormField>
      </div>
    );
  },
);

ProfilePhoto.displayName = "ProfilePhoto";
