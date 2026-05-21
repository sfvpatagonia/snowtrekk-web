const apiUrl = import.meta.env.VITE_API_URL;

async function createShop(data, token) {
  try {
    const response = await fetch(`${apiUrl}/shop`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

async function getShopsByUserId(userId, token) {
  try {
    const response = await fetch(`${apiUrl}/shop/user/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

async function getShopById(shopId, token) {
  try {
    const response = await fetch(`${apiUrl}/shop/${shopId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

async function updateShop(shopId, data, token) {
  try {
    const response = await fetch(`${apiUrl}/shop/${shopId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

async function advertiseService(shopId, service, token) {
  try {
    const response = await fetch(`${apiUrl}/shop/${shopId}/advertise-service`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ service }),
    });

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

async function changePassword(shopId, data, token) {
  try {
    const response = await fetch(`${apiUrl}/shop/${shopId}/password`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

async function changeShopImage(shopId, image, token) {
  try {
    const formData = new FormData();
    formData.append("image", image);
    const response = await fetch(`${apiUrl}/shop/${shopId}/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

async function addUserToShop(shopId, newUser, token) {
  try {
    const response = await fetch(`${apiUrl}/shop/${shopId}/user/${newUser}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

async function removeUserFromShop(shopId, userId, token) {
  try {
    const response = await fetch(`${apiUrl}/shop/${shopId}/user/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

async function makeAdmin(shopId, userId, token) {
  try {
    const response = await fetch(
      `${apiUrl}/shop/${shopId}/user/${userId}/admin`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

async function removeAdmin(shopId, userId, token) {
  try {
    const response = await fetch(
      `${apiUrl}/shop/${shopId}/user/${userId}/operator`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

async function changePolicy(shopId, policies, token) {
  try {
    const response = await fetch(`${apiUrl}/shop/${shopId}/policy`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(policies),
    });

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

async function changeDescription(shopId, description, token) {
  try {
    const response = await fetch(`${apiUrl}/shop/${shopId}/description`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
    });

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}


export default {
  createShop,
  getShopsByUserId,
  getShopById,
  updateShop,
  advertiseService,
  changePassword,
  addUserToShop,
  removeUserFromShop,
  makeAdmin,
  removeAdmin,
  changePolicy,
  changeDescription,
  changeShopImage,
};
