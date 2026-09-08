import api from "@/api/axios";

async function getSuggestions() {
  try {
    const response = await api.get(`/suggestion/`);
    return response.data;
  } catch (error) {
    return error.response?.data || { ok: false, message: "Network error" };
  }
}
async function deleteSuggestion(id) {
  try {
    const response = await api.delete(`/suggestion/${id}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

export default {
  getSuggestions,
  deleteSuggestion,
};
