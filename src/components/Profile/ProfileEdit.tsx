import { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMe, updateProfile, updatePassword } from "@/api/User";
import { FormField } from "@/components/Form/FormField/FormField";
import Icon from "@/components/types/Icon";
import styles from "./ProfileEdit.module.scss";
import stylesForm from "./ProfileForm.module.scss";
import customStyles from "@/components/Form/LoginForm/custom-login.module.scss";

export const ProfileEdit: FC = () => {
  const navigate = useNavigate();

  // Состояния для персональных данных
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  //   const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Состояния для смены пароля
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // Интерфейсные состояния
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // 1. Загружаем текущие данные пользователя при старте
  useEffect(() => {
    fetchMe()
      .then((user) => {
        if (user) {
          setFullName(user.full_name || "");
          setCity(user.city || "");
          setBio(user.bio || "");
          if (user.photo) {
            setPhotoPreview(user.photo);
          }
        } else {
          navigate("/login"); // Если токена нет или он протух
        }
      })
      .catch((err) => setErrors({ server: err.message }))
      .finally(() => setIsPageLoading(false));
  }, [navigate]);

  // Создаем ссылку для инпута

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Защита от случайной отправки формы
    fileInputRef.current?.click(); // Программно кликаем по скрытому инпуту
  };

  //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (e.target.files && e.target.files[0]) {
  //       const file = e.target.files[0];
  //       setPhoto(file);
  //       setPhotoPreview(URL.createObjectURL(file));
  //     }
  //   };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Ограничение в 2 МБ (2 * 1024 * 1024 байт)
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ photo: "Максимальный размер — 2 МБ" });
        return;
      }

      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!fullName.trim()) {
      setErrors({ fullName: "Поле ФИО обязательно к заполнению" });
      return;
    }

    if (newPassword || repeatPassword) {
      if (newPassword.length < 6) {
        setErrors({ newPassword: "Пароль должен быть не менее 6 символов" });
        return;
      }
      // Проверяем совпадение
      if (newPassword !== repeatPassword) {
        setErrors({ repeatPassword: "Пароли не совпадают" });
        return;
      }
    }

    setIsLoading(true);

    try {
      const requests: Promise<any>[] = [];

      // Действие 1: Собираем FormData для профиля
      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("city", city);
      //   formData.append("country", country);
      formData.append("bio", bio);
      //   if (photo) {
      //     formData.append("photo", photo);
      //   }

      if (photo && photo instanceof File) {
        formData.append("photo", photo);
      }

      requests.push(updateProfile(formData));

      // Действие 2: Если поля паролей заполнены, добавляем PATCH-запрос
      if (repeatPassword && newPassword) {
        requests.push(updatePassword(newPassword));
      }

      // Выполняем оба запроса параллельно
      await Promise.all(requests);

      // Обновляем имя в localStorage для Хедера
      localStorage.setItem("userName", fullName);
      if (photoPreview) {
        localStorage.setItem("userPhoto", photoPreview);
      }
      alert("Профиль успешно обновлен!");
      navigate("/");
    } catch (err: any) {
      setErrors({ server: err.message || "Ошибка при сохранении данных" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return <div className="container">Загрузка профиля...</div>;
  }

  const hasAnyError = Object.keys(errors).length > 0;
  const getInputClass = (fieldName: string) =>
    `${customStyles["custom__input"]} ${errors[fieldName] ? customStyles["custom__input--error"] : ""}`;

  return (
    <section className={styles.profile}>
      <div className="container">
        <form
          className={stylesForm.form__profile}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className={styles.profile__photo}>
            <FormField
              className={styles["profile__photo-field"]}
              errorMessage={errors.photo}
            >
              <div className={styles["profile__photo-container"]}>
                <div className={styles["profile__preview-wrapper"]}>
                  <img
                    src={photoPreview || "/images/avatar.jpg"}
                    alt="Превью профиля"
                    className={styles["profile__preview-img"]}
                  />
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={styles.profile__hiddenFileInput}
                  style={{ display: "none" }}
                />

                {/* <div className={styles["profile__photo-layout"]}> */}
                <div className={styles["profile__add"]}>
                  {/* НАСТОЯЩАЯ КНОПКА. Клик откроет выбор файла */}
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
              {/* </div> */}
            </FormField>
          </div>

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
                    onChange={(e) => setRepeatPassword(e.target.value)}
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
                    onChange={(e) => setNewPassword(e.target.value)}
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
                type="submit"
                className={`${styles["profile__save-btn"]} ${styles.btn}`}
                disabled={isLoading}
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
