import api from "@/api/axios";

async function getFavorites() {
  try {
    const response = await api.get(`/favorites/`);
    return response.data;
  } catch (error) {
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function checkIsFavorite(idService) {
  try {
    const response = await api.get(`/favorites/check/${idService}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { ok: false, message: "Network error" };
  }
}
async function setFavorite(idService) {
  try {
    const response = await api.post(`/favorites/${idService}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

export default {
  getFavorites,
  checkIsFavorite,
  setFavorite,
};
