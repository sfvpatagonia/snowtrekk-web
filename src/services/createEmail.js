const apiUrl = import.meta.env.VITE_API_URL;

export default async function createEmail(emailData) {
  try {
    const response = await fetch(`${apiUrl}/emails/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}
