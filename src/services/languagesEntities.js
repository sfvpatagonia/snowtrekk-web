const apiUrl = import.meta.env.VITE_API_URL;

async function get() {
  try {
    const response = await fetch(`${apiUrl}/languages/`, {
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

export default { get };
