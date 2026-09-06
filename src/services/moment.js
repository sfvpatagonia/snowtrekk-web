const apiUrl = import.meta.env.VITE_API_URL;

// Obtener todos los moments activos
async function getAllMoments() {
  try {
    const response = await fetch(`${apiUrl}/moments`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      return {
        ok: false,
        message: data?.message || `Request failed with status ${response.status}`,
      };
    }
    return data;
  } catch (error) {
    return { ok: false, message: error.message || "Network error" };
  }
}

export default {
  getAllMoments,
};
