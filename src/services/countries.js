const apiUrl = import.meta.env.VITE_API_URL;

export async function getCountryById(countryId) {
  try {
    const response = await fetch(`${apiUrl}/country/${countryId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}
