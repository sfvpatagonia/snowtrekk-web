const apiUrl = import.meta.env.VITE_API_URL;

export default async function newNews(news) {
  try {
    const response = await fetch(`${apiUrl}/news/`, {
      method: "POST",
      body: news,
    });
    const data = await response.json();
    return {
      ok: response.ok,
      data: data,
      message: data.message,
    };
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}
