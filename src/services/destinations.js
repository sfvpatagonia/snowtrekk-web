const apiUrl = import.meta.env.VITE_API_URL;

export async function getFeaturedDestination() {
  try {
    const response = await fetch(`${apiUrl}/destination/featuredDestination`, {
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

export async function getDestinationById(destinationId) {
  try {
    const response = await fetch(`${apiUrl}/destination/${destinationId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}
