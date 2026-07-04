const apiUrl = import.meta.env.VITE_API_URL;

async function getCountries() {
  try {
    const response = await fetch(`${apiUrl}/country/admin/`, {
      method: "GET",
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

async function getAllServices(limit, offset, token) {
  try {
    const response = await fetch(
      `${apiUrl}/admin/services/admin?limit=${limit}&offset=${offset}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

async function changeAdvertise(id, token) {
  try {
    const response = await fetch(
      `${apiUrl}/admin/services/${id}/change-advertise`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}
async function getShops(token) {
  try {
    const response = await fetch(`${apiUrl}/shop/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

async function getCollectorPendingPlaces(token) {
  try {
    const response = await fetch(`${apiUrl}/collector/pending`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

async function approveCollectorPlace(id, token) {
  try {
    const response = await fetch(`${apiUrl}/collector/approve/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

async function rejectCollectorPlace(id, reason, token) {
  try {
    const response = await fetch(`${apiUrl}/collector/reject/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

async function updateCollectorPlace(id, payload, token) {
  try {
    const response = await fetch(`${apiUrl}/collector/edit/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

async function deleteLocation({ id, type }, token) {
  try {
    const response = await fetch(`${apiUrl}/${type}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

async function updateBasicInfoShop(shop, token) {
  try {
    const response = await fetch(`${apiUrl}/shop/${shop.id}/info`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(shop),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}
async function updateBillingInfoShop(id, billingInfo, token) {
  try {
    const response = await fetch(`${apiUrl}/shop/${id}/billing`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(billingInfo),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}
async function updateBillingPriceShop(id, billingPrice, token) {
  try {
    const response = await fetch(`${apiUrl}/shop/${id}/price`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(billingPrice),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
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
  deleteLocation,
  updateBasicInfoShop,
  updateBillingInfoShop,
  updateBillingPriceShop,
};
