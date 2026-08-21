const apiUrl = import.meta.env.VITE_API_URL;

async function getMyPurchases(token) {
  try {
    const response = await fetch(`${apiUrl}/purchase/my-purchases`, {
      method: "GET",
      credentials: "include",
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

export default { getMyPurchases };
