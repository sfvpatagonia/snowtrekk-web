const apiUrl = import.meta.env.VITE_API_URL;

export default async function updateLead(lead) {
  try {
    const response = await fetch(`${apiUrl}/leads/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lead),
    });
    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}
