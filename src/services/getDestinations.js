const apiUrl = import.meta.env.VITE_API_URL;

export default async function getDestinations() {
  try {
    const response = await fetch(`${apiUrl}/destination/guide`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}
