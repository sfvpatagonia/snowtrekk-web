const apiUrl = import.meta.env.VITE_API_URL;

export default async function setImages(item, formData) {
  try {
    const response = await fetch(
      `${apiUrl}/${item.type}/images/${item.id}/`,
      {
        method: "POST",
        body: formData,
        headers: {
          // Asegúrate de no establecer 'Content-Type' manualmente
          // 'Content-Type': 'multipart/form-data' <- Esto no debe incluirse
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending images:", error);
    return { ok: false, message: "Network error" };
  }
}
