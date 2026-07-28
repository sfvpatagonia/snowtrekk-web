const apiUrl = import.meta.env.VITE_API_URL;

export async function getCityById(destinationId) {
  try {
    const response = await fetch(`${apiUrl}/city/${destinationId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}
export async function getCities() {
  try {
    const response = await fetch(`${apiUrl}/city/`, {
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

export async function newCity(city) {
  try {
    const response = await fetch(`${apiUrl}/city/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(city),
    });
    const data = await response.json();
    return {
      ok: response.ok,
      data: data,
      message: data.message,
    };
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}
