const apiUrl = import.meta.env.VITE_API_URL;

export default async function deleteLead(id) {
  try {
    const response = await fetch(`${apiUrl}/leads/${id}`, {
      method: "DELETE",
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
