const apiUrl = import.meta.env.VITE_API_URL;

export default async function getLeadsByRegion(regionId) {
  try {
    const response = await fetch(
      `${apiUrl}/brands/getInfoByRegion/${regionId}`,
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
