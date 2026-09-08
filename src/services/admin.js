import api from "@/api/axios";

const apiUrl = import.meta.env.VITE_API_URL;

async function getCountries() {
  try {
    const response = await fetch(`${apiUrl}/country/admin/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}

async function getAreas() {
  try {
    const response = await fetch(`${apiUrl}/area/admin/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}

async function getCities() {
  try {
    const response = await fetch(`${apiUrl}/city/admin/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}

async function getDestinations() {
  try {
    const response = await fetch(`${apiUrl}/destination/admin/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}

async function getActivities() {
  try {
    const response = await fetch(`${apiUrl}/activities/admin`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}

async function getRegions() {
  try {
    const response = await fetch(`${apiUrl}/region/admin/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}
async function getLeads(limit, offset) {
  try {
    const response = await fetch(
      `${apiUrl}/leads?limit=${limit}&offset=${offset}/`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}
async function searchLeads(searchQuery, limit, offset) {
  try {
    const response = await fetch(
      `${apiUrl}/leads/search?search=${searchQuery}&limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}

async function sendEmail(body) {
  try {
    const response = await fetch(`${apiUrl}/leads/send-email/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

async function getAllServices(limit, offset) {
  try {
    const response = await api.get(
      `/admin/services/admin?limit=${limit}&offset=${offset}/`,
    );
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function changeAdvertise(id) {
  try {
    const response = await api.put(`/admin/services/${id}/change-advertise`);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}
async function getShops() {
  try {
    const response = await api.get(`/shop/`);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function getCollectorPendingPlaces() {
  try {
    const response = await api.get(`/collector/pending`);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function approveCollectorPlace(id) {
  try {
    const response = await api.post(`/collector/approve/${id}`);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function rejectCollectorPlace(id, reason) {
  try {
    const response = await api.post(`/collector/reject/${id}`, { reason });
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function updateCollectorPlace(id, payload) {
  try {
    const response = await api.put(`/collector/edit/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function getCollectorSsoUrl() {
  try {
    const response = await api.get(`/collector/sso-url`);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function deleteLocation({ id, type }) {
  try {
    const response = await api.delete(`/${type}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function updateBasicInfoShop(shop) {
  try {
    const response = await api.put(`/shop/${shop.id}/info`, shop);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}
async function updateBillingInfoShop(id, billingInfo) {
  try {
    const response = await api.put(`/shop/${id}/billing`, billingInfo);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}
async function updateBillingPriceShop(id, billingPrice) {
  try {
    const response = await api.put(`/shop/${id}/price`, billingPrice);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

export default {
  getCountries,
  getAreas,
  getCities,
  getDestinations,
  getActivities,
  getRegions,
  getLeads,
  sendEmail,
  getAllServices,
  changeAdvertise,
  searchLeads,
  getShops,
  getCollectorPendingPlaces,
  approveCollectorPlace,
  rejectCollectorPlace,
  updateCollectorPlace,
  getCollectorSsoUrl,
  deleteLocation,
  updateBasicInfoShop,
  updateBillingInfoShop,
  updateBillingPriceShop,
};

export {
  getCountries,
  getAreas,
  getCities,
  getDestinations,
  getActivities,
  getRegions,
  getLeads,
  sendEmail,
  getAllServices,
  changeAdvertise,
  searchLeads,
  getShops,
  getCollectorPendingPlaces,
  approveCollectorPlace,
  rejectCollectorPlace,
  updateCollectorPlace,
  getCollectorSsoUrl,
  deleteLocation,
  updateBasicInfoShop,
  updateBillingInfoShop,
  updateBillingPriceShop,
};
