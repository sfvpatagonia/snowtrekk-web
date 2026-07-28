const apiUrl = import.meta.env.VITE_API_URL;

async function getStats(token) {
  try {
    const response = await fetch(`${apiUrl}/admin/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

export default { getStats };
export { getStats };
