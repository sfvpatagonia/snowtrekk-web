const apiUrl = import.meta.env.VITE_API_URL;

export default async function getEmails() {
  try {
    const response = await fetch(`${apiUrl}/emails/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}
