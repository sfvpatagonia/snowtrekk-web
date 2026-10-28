import api from "@/api/axios";

export default async function deleteEmail(id) {
  try {
    const response = await api.delete(`/emails/${id}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { ok: false, message: "Network error" };
  }
}
