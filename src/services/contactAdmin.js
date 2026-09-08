import api from "@/api/axios";

async function contactAdmin(body) {
  try {
    const response = await api.post(`/shop/send-email/`, body);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

export default {
  contactAdmin
};
