const apiUrl = import.meta.env.VITE_API_URL;

export default async function deleteLocation(item) {
  try {
    const response = await fetch(`${apiUrl}/${item.type}/${item.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}
