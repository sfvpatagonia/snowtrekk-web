import api from "@/api/axios";

async function getStats() {
  try {
    const response = await api.get(`/admin/stats`);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

export default { getStats };
export { getStats };
