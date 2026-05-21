const apiUrl = import.meta.env.VITE_API_URL;

async function getSuggestions() {
  try {
    const response = await fetch(`${apiUrl}/suggestion/`, {
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
async function deleteSuggestion(id) {
  try {
    const response = await fetch(`${apiUrl}/suggestion/${id}`, {
      method: "DELETE",
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

export default {
  getSuggestions,
  deleteSuggestion,
};
