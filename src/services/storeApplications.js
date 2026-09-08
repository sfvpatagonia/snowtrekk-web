import api from "@/api/axios";

const apiUrl = import.meta.env.VITE_API_URL;

async function registerStore(formData) {
  try {
    const response = await fetch(`${apiUrl}/stores/register`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

// Second positional param, kept for callers that pass status after the
// (now-unused, cookie-auth-replaced) token argument.
async function getApplications(_token, status) {
  try {
    const query = status ? `?status=${status}` : "";
    const response = await api.get(`/stores/applications${query}`);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function verifyApplication(id) {
  try {
    const response = await api.put(`/stores/applications/${id}/verify`);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function rejectApplication(id, reason) {
  try {
    const response = await api.put(`/stores/applications/${id}/reject`, { reason });
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function requestMoreInfo(id, message) {
  try {
    const response = await api.post(
      `/stores/applications/${id}/request-info`,
      { message },
    );
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
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
