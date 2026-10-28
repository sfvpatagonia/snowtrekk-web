import api from "@/api/axios";

export default async function getEmails() {
  try {
    const response = await api.get(`/emails/`);
    return response.data;
  } catch (error) {
    return error.response?.data || { ok: false, message: "Network error" };
  }
}
