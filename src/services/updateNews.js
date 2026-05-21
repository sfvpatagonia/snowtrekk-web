const apiUrl = import.meta.env.VITE_API_URL;

export default async function updateNews(news) {
  try {
    const response = await fetch(`${apiUrl}/news/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(news),
    });
    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}
