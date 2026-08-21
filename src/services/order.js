const apiUrl = import.meta.env.VITE_API_URL;

const getOrderByOrderNumber = async (orderNumber, token) => {
  try {
    const response = await fetch(
      `${apiUrl}/order/order-number/${orderNumber}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
};

export default { getOrderByOrderNumber };
