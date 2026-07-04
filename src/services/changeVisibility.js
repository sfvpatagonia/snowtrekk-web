const apiUrl = import.meta.env.VITE_API_URL;

export default async function changeVisibility(item) {
  try {
    const response = await fetch(`${apiUrl}/${item.type}/${item.field}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}
