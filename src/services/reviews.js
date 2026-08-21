const apiUrl = import.meta.env.VITE_API_URL;

async function getMyReviews(token) {
  try {
    const response = await fetch(`${apiUrl}/review/my-reviews`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

async function createReview(idService, data, token) {
  try {
    const response = await fetch(`${apiUrl}/review/services/${idService}`, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const review = await response.json();
    return review;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

export default {
  getMyReviews,
  createReview,
};
