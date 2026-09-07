const apiUrl = import.meta.env.VITE_API_URL;

async function getSuggestions(token) {
  try {
    const response = await fetch(`${apiUrl}/suggestion/`, {
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
async function deleteSuggestion(id, token) {
  try {
    const response = await fetch(`${apiUrl}/suggestion/${id}`, {
      method: "DELETE",
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
  getSuggestions,
  deleteSuggestion,
};
