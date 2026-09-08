import api from "@/api/axios";

async function getMyReviews() {
  try {
    const response = await api.get(`/review/my-reviews`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function createReview(idService, data) {
  try {
    const response = await api.post(`/review/services/${idService}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

export default {
  getMyReviews,
  createReview,
};
