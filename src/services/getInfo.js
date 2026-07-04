const apiUrl = import.meta.env.VITE_API_URL;

export default async function getInfo(query) {
  try {
    const response = await fetch(
      `${apiUrl}/information/${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}
