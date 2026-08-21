const apiUrl = import.meta.env.VITE_API_URL;

async function getFavorites(token) {
  try {
    const response = await fetch(`${apiUrl}/favorites/`, {
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

export default {
  getFavorites,
  checkIsFavorite,
  setFavorite,
};
