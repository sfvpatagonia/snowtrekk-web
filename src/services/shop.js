import api from "@/api/axios";

const apiUrl = import.meta.env.VITE_API_URL;

async function createShop(data) {
  try {
    const response = await api.post(`/shop`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function getShopsByUserId(userId) {
  try {
    const response = await api.get(`/shop/user/${userId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function getShopById(shopId) {
  try {
    const response = await api.get(`/shop/${shopId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

// Public shop detail view - no auth required, backend returns a
// public-safe field set (see shop.controller.js getPublicShopById)
async function getPublicShopById(shopId) {
  try {
    const response = await fetch(`${apiUrl}/shop/public/${shopId}`, {
      method: "GET",
    });

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

async function updateShop(shopId, data) {
  try {
    const response = await api.put(`/shop/${shopId}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function advertiseService(shopId, service) {
  try {
    const response = await api.post(`/shop/${shopId}/advertise-service`, { service });
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function changePassword(shopId, data) {
  try {
    const response = await api.put(`/shop/${shopId}/password`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function changeShopImage(shopId, image) {
  try {
    const formData = new FormData();
    formData.append("image", image);
    const response = await api.post(`/shop/${shopId}/image`, formData);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function addUserToShop(shopId, newUser) {
  try {
    const response = await api.post(`/shop/${shopId}/user/${newUser}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function removeUserFromShop(shopId, userId) {
  try {
    const response = await api.delete(`/shop/${shopId}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function makeAdmin(shopId, userId) {
  try {
    const response = await api.put(`/shop/${shopId}/user/${userId}/admin`);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function removeAdmin(shopId, userId) {
  try {
    const response = await api.put(`/shop/${shopId}/user/${userId}/operator`);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function changePolicy(shopId, policies) {
  try {
    const response = await api.post(`/shop/${shopId}/policy`, policies);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function changeDescription(shopId, description) {
  try {
    const response = await api.post(`/shop/${shopId}/description`, { description });
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}


export default {
  createShop,
  getShopsByUserId,
  getShopById,
  getPublicShopById,
  updateShop,
  advertiseService,
  changePassword,
  addUserToShop,
  removeUserFromShop,
  makeAdmin,
  removeAdmin,
  changePolicy,
  changeDescription,
  changeShopImage,
};
