import api from "@/api/axios";

const getOrderByOrderNumber = async (orderNumber) => {
  try {
    const response = await api.get(`/order/order-number/${orderNumber}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
};

export default { getOrderByOrderNumber };
