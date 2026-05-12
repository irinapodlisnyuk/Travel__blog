export async function validateResponse(response: Response): Promise<Response> {
  if (!response.ok) {
    let errorMessage = "Произошла ошибка";
    
    try {
      const data = await response.clone().json();
      
      if (data.messages) {
        errorMessage = Object.values(data.messages).flat().join(", ");
      } else {
        errorMessage = data.error || data.message || errorMessage;
      }
    } catch {
      try {
        errorMessage = await response.clone().text();
      } catch {
        errorMessage = `Ошибка сервера: ${response.status}`;
      }
    }
    
    throw new Error(errorMessage);
  }

  return response;
}