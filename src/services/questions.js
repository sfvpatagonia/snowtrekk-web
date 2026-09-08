import api from "@/api/axios";

export const newQuestion = async (id, question) => {
  try {
    const response = await api.post(`/admin/service/${id}/questions`, question);
    return response.data;
  } catch (error) {
    return error.response?.data || { ok: false, message: "Network error" };
  }
};

export const newAnswer = async (id, questionId, answer) => {
  try {
    const response = await api.post(
      `/admin/service/${id}/questions/${questionId}`,
      answer,
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { ok: false, message: "Network error" };
  }
};
