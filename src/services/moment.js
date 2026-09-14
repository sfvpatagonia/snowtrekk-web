const apiUrl = import.meta.env.VITE_API_URL;

// Obtener todos los moments activos, opcionalmente filtrados por destino
async function getAllMoments(destino) {
  try {
    const url = destino ? `${apiUrl}/moments?destination=${destino}` : `${apiUrl}/moments`;
    const response = await fetch(url, {
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
