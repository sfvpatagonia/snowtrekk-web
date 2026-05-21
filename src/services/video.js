const apiUrl = import.meta.env.VITE_API_URL;

// Obtener todos los videos
async function getAllVideos(token) {
  try {
    const response = await fetch(`${apiUrl}/video/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

// Obtener video por ID
async function getVideoById(id, token) {
  try {
    const response = await fetch(`${apiUrl}/video/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

// Obtener videos por destino
async function getVideosByDestination(idDestination, token) {
  try {
    const response = await fetch(
      `${apiUrl}/video/destination/${idDestination}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

// Obtener videos paginados
async function getVideosPaginated(
  page = 1,
  limit = 2,
  idDestination = null,
  token
) {
  try {
    let url = `${apiUrl}/video/paginated?page=${page}&limit=${limit}`;
    if (idDestination) {
      url += `&idDestination=${idDestination}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

// Crear video
async function createVideo(formData, token) {
  try {
    const response = await fetch(`${apiUrl}/video/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // FormData no necesita Content-Type
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

// Actualizar video
async function updateVideo(id, formData, token) {
  try {
    const response = await fetch(`${apiUrl}/video/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // FormData no necesita Content-Type
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

// Eliminar video
async function deleteVideo(id, token) {
  try {
    const response = await fetch(`${apiUrl}/video/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

async function reorderDestinations(destinationId, newOrder, token) {
  try {
    const response = await fetch(`${apiUrl}/video/reorder`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ destinationId, newOrder }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return { ok: false, message: "Network error" };
  }
}

export default {
  getAllVideos,
  getVideoById,
  getVideosByDestination,
  getVideosPaginated,
  createVideo,
  updateVideo,
  deleteVideo,
  reorderDestinations,
};
