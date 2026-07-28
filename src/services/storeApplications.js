const apiUrl = import.meta.env.VITE_API_URL;

async function registerStore(formData) {
  try {
    const response = await fetch(`${apiUrl}/stores/register`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

async function getApplications(token, status) {
  try {
    const query = status ? `?status=${status}` : "";
    const response = await fetch(`${apiUrl}/stores/applications${query}`, {
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

async function verifyApplication(id, token) {
  try {
    const response = await fetch(`${apiUrl}/stores/applications/${id}/verify`, {
      method: "PUT",
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

async function rejectApplication(id, reason, token) {
  try {
    const response = await fetch(`${apiUrl}/stores/applications/${id}/reject`, {
      method: "PUT",
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

async function requestMoreInfo(id, message, token) {
  try {
    const response = await fetch(
      `${apiUrl}/stores/applications/${id}/request-info`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

export default {
  registerStore,
  getApplications,
  verifyApplication,
  rejectApplication,
  requestMoreInfo,
};
export {
  registerStore,
  getApplications,
  verifyApplication,
  rejectApplication,
  requestMoreInfo,
};
