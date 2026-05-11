
export async function validateResponse(response: Response): Promise<Response> {
  if (!response.ok) {
    let errorMessage = "Произошла ошибка";
    
    try {

      const data = await response.json();
      errorMessage = data.error || errorMessage;
    } catch {
    
      try {
        errorMessage = await response.text();
      } catch {
        errorMessage = `Ошибка сервера: ${response.status}`;
      }
    }
    
    throw new Error(errorMessage);
  }

  return response;
}