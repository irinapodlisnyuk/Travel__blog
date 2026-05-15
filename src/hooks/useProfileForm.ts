import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMe, updateProfile, updatePassword } from "@/api/User";
import { compressImage } from "@/utils/compressImage";
import { BASE_URL } from "../api/config";

const getFullPhotoUrl = (path: string | null) => 
  !path ? null : path.startsWith("http") ? path : `${BASE_URL}${path}`;

export const useProfileForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Текстовые поля и превью
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // Интерфейс
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Слепок данных для отмены изменений
  const [initialData, setInitialData] = useState<any>(null);

  // 1. Первичная загрузка профиля
  useEffect(() => {
    fetchMe()
      .then((user) => {
        if (!user) return navigate("/login");
        setFullName(user.full_name || "");
        setCity(user.city || "");
        setBio(user.bio || "");
        setPhotoPreview(getFullPhotoUrl(user.photo));
        setInitialData(user);
      })
      .catch((err) => setErrors({ server: err.message }))
      .finally(() => setIsPageLoading(false));
  }, [navigate]);

  // 2. Отмена изменений (кнопка Назад)
  const resetForm = useCallback(() => {
    if (!initialData) return;
    setFullName(initialData.full_name || "");
    setCity(initialData.city || "");
    setBio(initialData.bio || "");
    setPhotoPreview(getFullPhotoUrl(initialData.photo));
    setNewPassword("");
    setRepeatPassword("");
    setErrors({});
  }, [initialData]);

  // 3. МГНОВЕННАЯ ЗАГРУЗКА ФОТО (при выборе файла)
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrors(({ photo, ...rest }) => rest); // Быстро очищаем старую ошибку фото

    try {
      // Сжимаем через внешнюю утилиту
      const compressedBlob = await compressImage(file);
      const compressedFile = new File([compressedBlob], file.name, { type: "image/jpeg" });

      // Мгновенно обновляем превью на экране
      setPhotoPreview(URL.createObjectURL(compressedFile));

      // Собираем FormData (отправляем фото + текущие тексты, чтобы не затереть их)
      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("city", city);
      formData.append("bio", bio);
      formData.append("photo", compressedFile, compressedFile.name);

      const updatedUser = await updateProfile(formData);
      const finalUrl = getFullPhotoUrl(updatedUser?.photo);

      // Фиксируем новые данные
      setPhotoPreview(finalUrl);
      setInitialData(updatedUser);
      if (finalUrl) localStorage.setItem("userPhoto", finalUrl);
      window.dispatchEvent(new Event("storage"));
      
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, photo: err.message || "Ошибка загрузки фото" }));
    } finally {
      setIsLoading(false);
    }
  }, [fullName, city, bio]); // Зависит от текстов, чтобы отправлять актуальные строки

  // 4. СОХРАНЕНИЕ ТОЛЬКО ТЕКСТА И ПАРОЛЕЙ (по кнопке)
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Поле ФИО обязательно";
    if (newPassword && newPassword.length < 6) newErrors.newPassword = "Пароль от 6 символов";
    if (newPassword !== repeatPassword) newErrors.repeatPassword = "Пароли не совпадают";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("full_name", fullName.trim());
      formData.append("city", city.trim());
      formData.append("bio", bio.trim());
      if (initialData?.photo) formData.append("photo", initialData.photo);

      const requests: Promise<any>[] = [updateProfile(formData)];
      if (newPassword) requests.push(updatePassword(newPassword));

      await Promise.all(requests);

      setInitialData((prev: any) => ({ ...prev, full_name: fullName, city, bio }));
      localStorage.setItem("userName", fullName);
      window.dispatchEvent(new Event("storage"));

      return true;
    } catch (err: any) {
      setErrors({ server: err.message || "Ошибка сохранения" });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fullName, city, bio, newPassword, repeatPassword, initialData?.photo]);

  // Мемоизация для сгруппированного вывода
  const state = useMemo(() => ({
    fullName, city, bio, photoPreview, newPassword, repeatPassword, errors, isLoading, isPageLoading,
  }), [fullName, city, bio, photoPreview, newPassword, repeatPassword, errors, isLoading, isPageLoading]);

  const actions = useMemo(() => ({
    setFullName, setCity, setBio, setNewPassword, setRepeatPassword, handleFileChange, handleSubmit, fileInputRef, resetForm,
  }), [handleFileChange, handleSubmit, resetForm]);

  return { state, actions };
};


// import { fetchMe, updateProfile } from "@/api/User";
// import { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { useNavigate } from "react-router-dom";

// import { BASE_URL } from "@/api/config";

// const getFullPhotoUrl = (photoPath: string | null): string | null => {
//   if (!photoPath) return null;
//   return photoPath.startsWith("http") ? photoPath : `${BASE_URL}${photoPath}`;
// };

// export const useProfileForm = () => {
//   const navigate = useNavigate();

//   const [fullName, setFullName] = useState("");
//   const [city, setCity] = useState("");
//   const [bio, setBio] = useState("");
//   const [photo, setPhoto] = useState<File | null>(null);
//   const [photoPreview, setPhotoPreview] = useState<string | null>(null);
//   const [newPassword, setNewPassword] = useState("");
//   const [repeatPassword, setRepeatPassword] = useState("");

//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [isPageLoading, setIsPageLoading] = useState(true);

//   // Хранилище серверных данных для отката изменений
//   const [initialData, setInitialData] = useState<{
//     full_name: string;
//     city: string;
//     bio: string;
//     photo: string | null;
//   } | null>(null);

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // 1. Первичная загрузка профиля при входе на страницу
//   useEffect(() => {
//     fetchMe()
//       .then((user) => {
//         if (user) {
//           const data = {
//             full_name: user.full_name || "",
//             city: user.city || "",
//             bio: user.bio || "",
//             photo: user.photo || null,
//           };

//           setFullName(data.full_name);
//           setCity(data.city);
//           setBio(data.bio);
//           setPhotoPreview(getFullPhotoUrl(data.photo));
//           setInitialData(data);
//         } else {
//           navigate("/login");
//         }
//       })
//       .catch((err: Error) => setErrors({ server: err.message }))
//       .finally(() => setIsPageLoading(false));
//   }, [navigate]);

//   // 2. Безопасное удаление blob-ссылок из памяти при закрытии страницы
//   useEffect(() => {
//     return () => {
//       if (photoPreview && photoPreview.startsWith("blob:")) {
//         URL.revokeObjectURL(photoPreview);
//       }
//     };
//   }, [photoPreview]);

//   // 3.  ЗАГРУЗКА И СОХРАНЕНИЕ ФОТО 
//  const handleFileChange = useCallback(
//   async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files || !e.target.files[0]) return;

//     const originalFile = e.target.files[0];

//     // Показываем временное превью, пока картинка обрабатывается
//     const localPreviewUrl = URL.createObjectURL(originalFile);
//     setPhotoPreview(localPreviewUrl);
//     setIsLoading(true);

//     // Сжатие картинки (чтобы избежать ошибки 413 Content Too Large)
//     const img = new Image();
//     img.src = localPreviewUrl;
    
//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       let width = img.width;
//       let height = img.height;
//       const MAX_SIZE = 800;

//       if (width > height && width > MAX_SIZE) {
//         height *= MAX_SIZE / width;
//         width = MAX_SIZE;
//       } else if (height > MAX_SIZE) {
//         width *= MAX_SIZE / height;
//         height = MAX_SIZE;
//       }

//       canvas.width = width;
//       canvas.height = height;
//       const ctx = canvas.getContext("2d");
//       if (!ctx) return;
//       ctx.drawImage(img, 0, 0, width, height);

//       canvas.toBlob(
//         async (blob) => {
//           if (!blob) {
//             setIsLoading(false);
//             return;
//           }

//           const fileName = originalFile.name.includes('.') ? originalFile.name : `${originalFile.name}.jpg`;
//           const compressedFile = new File([blob], fileName, {
//             type: originalFile.type || "image/jpeg",
//           });

//           try {
//             // --- МГНОВЕННАЯ ОТПРАВКА НА СЕРВЕР ---
//             const imageFormData = new FormData();
            
//             // Отправляем ТЕКУЩИЕ текстовые данные из стейтов
//             imageFormData.append("full_name", fullName);
//             imageFormData.append("city", city);
//             imageFormData.append("bio", bio);
//             // Прикрепляем сам файл
//             imageFormData.append("photo", compressedFile, compressedFile.name);

//             // Вызываем POST-запрос к API
//             const updatedUser = await updateProfile(imageFormData);

//             // Читаем новый путь с сервера и генерируем полную ссылку
//             const serverPhotoPath = updatedUser?.photo || null;
//             const finalPhotoUrl = getFullPhotoUrl(serverPhotoPath);

//             // Синхронизируем состояние хука
//             setPhotoPreview(finalPhotoUrl);
//             setInitialData({
//               full_name: updatedUser.full_name || "",
//               city: updatedUser.city || "",
//               bio: updatedUser.bio || "",
//               photo: serverPhotoPath,
//             });

//             // Обновляем localStorage для шапки (AppHeader)
//             if (finalPhotoUrl) {
//               localStorage.setItem("userPhoto", finalPhotoUrl);
//             }
//             window.dispatchEvent(new Event("storage"));

//           } catch (err: any) {
//             setErrors((prev) => ({
//               ...prev,
//               photo: err.message || "Не удалось загрузить фото на сервер",
//             }));
//           } finally {
//             setIsLoading(false);
//           }
//         },
//         originalFile.type || "image/jpeg",
//         0.8
//       );
//     };
//   },
//   [fullName, city, bio] // Хук должен следить за текущими текстами, чтобы не затереть их на сервере
// );

//   const resetForm = useCallback(() => {
//     if (!initialData) return;

//     setPhoto(null); 
//     setPhotoPreview(getFullPhotoUrl(initialData.photo));
//     setFullName(initialData.full_name);
//     setCity(initialData.city);
//     setBio(initialData.bio);
//     setNewPassword("");
//     setRepeatPassword("");
//     setErrors({});
//   }, [initialData]);

//   // 4. Отправка формы ( handleSubmit )
//   const handleSubmit = useCallback(
//     async (e: React.FormEvent) => {
//       e.preventDefault();
//       const newErrors: Record<string, string> = {};

//       if (!fullName.trim()) {
//         newErrors.fullName = "Поле ФИО обязательно к заполнению";
//       }

//       if (Object.keys(newErrors).length > 0) {
//         setErrors(newErrors);
//         return false;
//       }

//       setIsLoading(true);
//       try {
//         const textFormData = new FormData();
//         textFormData.append("full_name", fullName);
//         textFormData.append("city", city);
//         textFormData.append("bio", bio);

//         if (photo && photo instanceof File) {
//           textFormData.append("photo", photo);
//         }

//         const updatedUser = await updateProfile(textFormData);

//         const serverPhotoPath = updatedUser?.photo || null;
//         const finalPhotoUrl = getFullPhotoUrl(serverPhotoPath);

//         // Фиксируем новые данные в памяти
//         setInitialData({
//           full_name: updatedUser.full_name || "",
//           city: updatedUser.city || "",
//           bio: updatedUser.bio || "",
//           photo: serverPhotoPath,
//         });

//         // ОЧИЩАЕМ стейт выбранного файла, так как он уже успешно сохранился на сервере!
//         // Это предотвратит повторную отправку старого файла при следующем сохранении текста.
//         setPhoto(null);

//         if (finalPhotoUrl) {
//           //setPhotoPreview(finalPhotoUrl);
//           localStorage.setItem("userPhoto", finalPhotoUrl);
//         }

//         localStorage.setItem("userName", updatedUser.full_name);
//         window.dispatchEvent(new Event("storage"));

//         return true;
//       } catch (err: any) {
//         setErrors({
//           server: err.message || "Ошибка при сохранении",
//         });
//         return false;

//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [fullName, city, bio, photo], // Следим за изменениями стейтов
//   );

//   const state = useMemo(
//     () => ({
//       fullName,
//       city,
//       bio,
//       photoPreview,
//       newPassword,
//       repeatPassword,
//       errors,
//       isLoading,
//       isPageLoading,
//     }),
//     [
//       fullName,
//       city,
//       bio,
//       photoPreview,
//       newPassword,
//       repeatPassword,
//       errors,
//       isLoading,
//       isPageLoading,
//     ],
//   );

//   const actions = useMemo(
//     () => ({
//       setFullName,
//       setCity,
//       setBio,
//       setNewPassword,
//       setRepeatPassword,
//       handleFileChange,
//       handleSubmit,
//       fileInputRef,
//       resetForm,
//     }),
//     [handleFileChange, handleSubmit, resetForm],
//   );

//   return { state, actions };
// };
