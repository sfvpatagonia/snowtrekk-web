// src/services/createPurchase.js
const apiUrl = import.meta.env.VITE_API_URL;

export default async function createPurchase(fullobject, token) {
  try {
    const response = await fetch(`${apiUrl}/order/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,       // ← aquí
      },
      body: JSON.stringify(fullobject),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}
