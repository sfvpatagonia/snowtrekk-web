const apiUrl = import.meta.env.VITE_API_URL;

export default async function getLeadsByArea(area) {
  try {
    const response = await fetch(
      `${apiUrl}/leads/getInfoByArea/${area}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}
