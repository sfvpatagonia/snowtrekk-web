const apiUrl = import.meta.env.VITE_API_URL;

async function getUser(id, token) {
  try {
    const response = await fetch(`${apiUrl}/user/${id}`, {
      method: "GET",
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
async function getCurrentUser(token) {
  try {
    const response = await fetch(`${apiUrl}/user/information`, {
      method: "GET",
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
async function checkIsFavorite(idService, token) {
  try {
    const response = await fetch(`${apiUrl}/favorites/check/${idService}`, {
      method: "GET",
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

async function updateUser(user, token) {
  try {
    const response = await fetch(`${apiUrl}/user/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}
async function changePassword(passwords, token) {
  try {
    const response = await fetch(`${apiUrl}/user/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwords),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}

async function getAllUsers(limit, offset, token) {
  try {
    const response = await fetch(
      `${apiUrl}/user?limit=${limit}&offset=${offset}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

async function deleteUser(id, token) {
  try {
    const response = await fetch(`${apiUrl}/user/${id}`, {
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
async function blockUser(id, token) {
  try {
    const response = await fetch(`${apiUrl}/user/${id}/block`, {
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

async function makeAdmin(id, token) {
  try {
    const response = await fetch(`${apiUrl}/user/${id}/admin`, {
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

async function logIn(credentials) {
  try {
    const response = await fetch(`${apiUrl}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

async function verifyTokenRequest(token) {
  try {
    const response = await fetch(`${apiUrl}/user/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      return { status: response.status, message: response.data.message };
    }
  } catch (error) {
    console.log(error);
  }
}

async function changeUserImage(userId, image, token) {
  try {
    const formData = new FormData();
    formData.append("image", image);
    const response = await fetch(`${apiUrl}/user/${userId}/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

async function activateAccount(token, password) {
  try {
    const response = await fetch(`${apiUrl}/user/activate`, {
      method: "POST",
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
  changeUserImage,
  getCurrentUser,
  logIn,
  verifyTokenRequest,
  activateAccount,
};
