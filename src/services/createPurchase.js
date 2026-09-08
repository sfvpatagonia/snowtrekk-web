// src/services/createPurchase.js
import api from "@/api/axios";

export default async function createPurchase(fullobject) {
  try {
    const response = await api.post(`/order/`, fullobject);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}
