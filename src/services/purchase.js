import api from "@/api/axios";

async function getMyPurchases() {
  try {
    const response = await api.get(`/purchase/my-purchases`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

export default { getMyPurchases };
