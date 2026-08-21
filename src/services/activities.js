const apiUrl = import.meta.env.VITE_API_URL;

async function getActivities() {
  try {
    const response = await fetch(`${apiUrl}/activities/`, {
      method: "GET",
      credentials: "include",
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

async function getActivitiesName() {
  try {
    const response = await fetch(`${apiUrl}/activities/names/`, {
      method: "GET",
      credentials: "include",
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

async function newActivity(activity) {
  try {
    const response = await fetch(`${apiUrl}/activities/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activity),
    });
    const data = await response.json();

    return data;
  } catch (error) {
    return { ok: false, message: "Network error" };
  }
}

async function updateActivity(activity, token) {
  try {
    const response = await fetch(`${apiUrl}/activities/${activity.id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(activity),
    });
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

async function getFeaturedActivities() {
  try {
    const response = await fetch(`${apiUrl}/activities/featured/`, {
      method: "GET",
      credentials: "include",
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
  getActivities,
  getActivitiesName,
  newActivity,
  updateActivity,
  getFeaturedActivities,
};
