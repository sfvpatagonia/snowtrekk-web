const apiUrl = import.meta.env.VITE_API_URL;

export default async function newActivity(activity) {
  try {
    const response = await fetch(`${apiUrl}/activities/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activity),
    });
    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}
