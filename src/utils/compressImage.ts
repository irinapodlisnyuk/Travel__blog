export const compressImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(img.src); // Освобождаем память от временной ссылки
      
      const canvas = document.createElement("canvas");
      const MAX_SIZE = 800; // Оптимальный размер для аватарки
      let { width, height } = img;

      // Пропорциональное изменение размеров
      if (width > height && width > MAX_SIZE) {
        height *= MAX_SIZE / width;
        width = MAX_SIZE;
      } else if (height > MAX_SIZE) {
        width *= MAX_SIZE / height;
        height = MAX_SIZE;
      }

      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return reject(new Error("Не удалось получить контекст Canvas (Canvas context error)"));
      }
      
      // Отрисовка с новыми размерами
      ctx.drawImage(img, 0, 0, width, height);
      
      // Конвертация в Blob (качество 80%)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Не удалось преобразовать изображение в Blob"));
          }
        }, 
        "image/jpeg", 
        0.8
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src); // Чистим память в случае ошибки загрузки файла
      reject(new Error("Ошибка при чтении файла изображения"));
    };
  });
};