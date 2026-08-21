const apiUrl = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

async function getSuggestions() {
  try {
    const response = await fetch(`${apiUrl}/suggestion/`, {
      method: "GET",
      credentials: "include",
      headers: authHeaders(),
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
      credentials: "include",
      headers: authHeaders(),
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
