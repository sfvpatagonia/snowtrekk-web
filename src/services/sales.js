const apiUrl = import.meta.env.VITE_API_URL;

async function getShopSales(idShop, token) {
  console.log(`Fetching sales for shop ID: ${idShop}`);
  
  try {
    const response = await fetch(`${apiUrl}/order/shopOrders?idShop=${idShop}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

export default {
    getShopSales
};
