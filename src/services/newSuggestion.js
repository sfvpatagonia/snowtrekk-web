const apiUrl = import.meta.env.VITE_API_URL;

export default async function newSuggestion(suggestion) {
  try {
    const response = await fetch(`${apiUrl}/suggestion/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(suggestion),
    });
    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}
