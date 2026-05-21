const apiUrl = import.meta.env.VITE_API_URL;

export default async function newLead(lead) {
  try {
    const response = await fetch(`${apiUrl}/leads/`, {
      method: "POST",
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
