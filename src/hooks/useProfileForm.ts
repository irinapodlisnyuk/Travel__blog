import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchMe, updateProfile, updatePassword } from "@/api/User";
import { compressImage } from "@/utils/compressImage";
import { ProfileSchema, ProfileFormData } from "@/schemas/ProfileSchema";
import { BASE_URL } from "@/api/config";

const getFullPhotoUrl = (path: string | null) =>
  !path ? null : path.startsWith("http") ? path : `${BASE_URL}${path}`;

export const useProfileForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [initialUser, setInitialUser] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      fullName: "",
      city: "",
      bio: "",
      newPassword: "",
      repeatPassword: "",
    },
  });

  const bioValue = watch("bio") || "";

  // 1. Загрузка данных профиля
  useEffect(() => {
    fetchMe()
      .then((user) => {
        if (!user) return navigate("/login");

        setInitialUser(user);
        setPhotoPreview(getFullPhotoUrl(user.photo));

        reset({
          fullName: user.full_name || "",
          city: user.city || "",
          bio: user.bio || "",
          newPassword: "",
          repeatPassword: "",
        });
      })
      .catch((err) => setServerError(err.message))
      .finally(() => setIsPageLoading(false));
  }, [navigate, reset]);

  // 2. Отмена изменений (Назад)
  const resetForm = useCallback(() => {
    if (!initialUser) return;
    setPhotoPreview(getFullPhotoUrl(initialUser.photo));
    setServerError(null);
    reset({
      fullName: initialUser.full_name || "",
      city: initialUser.city || "",
      bio: initialUser.bio || "",
      newPassword: "",
      repeatPassword: "",
    });
  }, [initialUser, reset]);

  // 3. Мгновенная загрузка фото
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsLoading(true);
      setServerError(null);

      try {
        const compressedBlob = await compressImage(file);
        const compressedFile = new File([compressedBlob], file.name, {
          type: "image/jpeg",
        });

        // 1. Сразу показываем локальное превью, чтобы юзер видел картинку мгновенно
        setPhotoPreview(URL.createObjectURL(compressedFile));

        const currentValues = getValues();

        const formData = new FormData();
        formData.append("full_name", currentValues.fullName.trim()); 
        formData.append("city", (currentValues.city || "").trim());
        formData.append("bio", (currentValues.bio || "").trim());
        formData.append("photo", compressedFile, compressedFile.name);

        const updatedUser = await updateProfile(formData);
        const finalUrl = getFullPhotoUrl(updatedUser?.photo);

        setPhotoPreview(finalUrl);
        setInitialUser(updatedUser);

        if (finalUrl) localStorage.setItem("userPhoto", finalUrl);
        window.dispatchEvent(new Event("storage"));
      } catch (err: any) {
        setServerError(err.message || "Ошибка загрузки фото");
      } finally {
        setIsLoading(false);
      }
    },
    [getValues],
  );

  // 4. СОХРАНЕНИЕ ТЕКСТА И ПАРОЛЕЙ (Исправлено)
  const onFormSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const formData = new FormData();
      formData.append("full_name", data.fullName.trim());
      formData.append("city", (data.city || "").trim());
      formData.append("bio", (data.bio || "").trim());

      if (initialUser?.photo) {
        formData.append("photo", initialUser.photo);
      }

      const requests: Promise<any>[] = [updateProfile(formData)];
      if (data.newPassword) requests.push(updatePassword(data.newPassword));

      const [updatedUser] = await Promise.all(requests);

      // Важно: обновляем initialUser актуальными текстовыми данными и сохраняем фото
      setInitialUser(updatedUser);
      setPhotoPreview(getFullPhotoUrl(updatedUser?.photo));

      localStorage.setItem("userName", data.fullName);
      window.dispatchEvent(new Event("storage"));

      reset({ ...data, newPassword: "", repeatPassword: "" });
      return true;
    } catch (err: any) {
      setServerError(err.message || "Ошибка сохранения");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Трансформация ошибок
  const formErrors: Record<string, string> = {};
  Object.keys(errors).forEach((key) => {
    const errorProp = key as keyof ProfileFormData;
    if (errors[errorProp]?.message) {
      formErrors[errorProp] = errors[errorProp]!.message!;
    }
  });
  if (serverError) formErrors.server = serverError;

  return {
    state: {
      photoPreview,
      errors: formErrors,
      isLoading,
      isPageLoading,
      bioLength: bioValue.length,
    },
    actions: useMemo(
      () => ({
        register,
        getValues,
        handleSubmit,
        onFormSubmit,
        handleFileChange,
        fileInputRef,
        resetForm,
      }),
      [register, getValues, handleSubmit, handleFileChange, resetForm],
    ),
  };
};