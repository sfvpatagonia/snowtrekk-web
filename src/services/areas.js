const apiUrl = import.meta.env.VITE_API_URL;

export async function getAreas() {
  try {
    const response = await fetch(`${apiUrl}/area/`, {
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

export async function newArea(area) {
  try {
    const response = await fetch(`${apiUrl}/area/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(area),
    });
    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}

export async function getAreaById(areaId) {
  try {
    const response = await fetch(`${apiUrl}/area/${areaId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}
