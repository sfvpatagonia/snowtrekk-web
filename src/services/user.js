import api from "@/api/axios";

const apiUrl = import.meta.env.VITE_API_URL;

async function getUser(id) {
  try {
    const response = await api.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { ok: false, message: "Network error" };
  }
}
async function getCurrentUser() {
  try {
    const response = await fetch(`${apiUrl}/user/information`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}
async function checkIsFavorite(idService, token) {
  try {
    const response = await fetch(`${apiUrl}/favorites/check/${idService}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}
async function setFavorite(idService, token) {
  try {
    const response = await fetch(`${apiUrl}/favorites/${idService}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}

async function updateUser(user) {
  try {
    const response = await fetch(`${apiUrl}/user/`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}
async function changePassword(passwords) {
  try {
    const response = await fetch(`${apiUrl}/user/change-password`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwords),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}

async function getAllUsers(limit, offset) {
  try {
    const response = await api.get(`/user?limit=${limit}&offset=${offset}/`);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function deleteUser(id) {
  try {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}
async function blockUser(id) {
  try {
    const response = await api.put(`/user/${id}/block`);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function makeAdmin(id) {
  try {
    const response = await api.put(`/user/${id}/admin`);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function makeSuperAdmin(id) {
  try {
    const response = await api.put(`/user/${id}/superadmin`);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function logIn(credentials) {
  try {
    const response = await fetch(`${apiUrl}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

async function verifyTokenRequest() {
  try {
    const response = await api.get(`/user/verify`);
    return response.data;
  } catch (error) {
    if (error.response) {
      return { status: error.response.status, message: error.response.data?.message };
    }
    console.log(error);
  }
}

async function changeUserImage(userId, image) {
  try {
    const formData = new FormData();
    formData.append("image", image);
    const response = await fetch(`${apiUrl}/user/${userId}/image`, {
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

async function preRegister(payload) {
  try {
    const response = await fetch(`${apiUrl}/user/pre-register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
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

// Single source of truth for "am I logged in, as what role" — reads the
// httpOnly session_token cookie set by login/verify-magic-link.
async function getMe() {
  try {
    const response = await fetch(`${apiUrl}/user/me`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();

    // 401 means no active Trecker session, which is expected for
    // anonymous visitors — not an error worth logging.
    if (response.status === 401) {
      return { ok: false, status: 401 };
    }

    if (!response.ok) {
      console.error("getMe failed:", response.status, data?.message);
    }

    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

async function logout() {
  try {
    const response = await fetch(`${apiUrl}/user/logout`, {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}

// Unauthenticated, read-only lookup — lets a form recognize a returning
// email before any real auth action.
async function checkEmail(email) {
  try {
    const response = await fetch(
      `${apiUrl}/user/check-email?email=${encodeURIComponent(email)}`,
      { method: "GET", credentials: "include" }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}

async function completeVerification(payload) {
  try {
    const response = await fetch(`${apiUrl}/user/complete-verification`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}

async function requestPasswordReset(email) {
  try {
    const response = await fetch(`${apiUrl}/user/request-password-reset`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}

async function resetPassword(token, newPassword) {
  try {
    const response = await fetch(`${apiUrl}/user/reset-password`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}

async function activateAccount(token, password) {
  try {
    const response = await fetch(`${apiUrl}/user/activate`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

export default {
  getUser,
  checkIsFavorite,
  setFavorite,
  updateUser,
  changePassword,
  getAllUsers,
  deleteUser,
  blockUser,
  makeAdmin,
  makeSuperAdmin,
  changeUserImage,
  getCurrentUser,
  logIn,
  verifyTokenRequest,
  activateAccount,
  preRegister,
  getMe,
  logout,
  checkEmail,
  completeVerification,
  requestPasswordReset,
  resetPassword,
};
