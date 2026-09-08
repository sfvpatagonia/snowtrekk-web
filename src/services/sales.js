import api from "@/api/axios";

async function getShopSales(idShop) {
  console.log(`Fetching sales for shop ID: ${idShop}`);

  try {
    const response = await api.get(`/order/shopOrders?idShop=${idShop}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

export default {
    getShopSales
};
