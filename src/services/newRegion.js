const apiUrl = import.meta.env.VITE_API_URL;

export default async function newRegion(region) {
  try {
    const response = await fetch(`${apiUrl}/region/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(region),
    });
    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}
