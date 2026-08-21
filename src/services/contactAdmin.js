const apiUrl = import.meta.env.VITE_API_URL;

async function contactAdmin(body,token) {  
  try {
    const response = await fetch(`${apiUrl}/shop/send-email/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

export default {
  contactAdmin
};
