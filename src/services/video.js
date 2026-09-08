import api from "@/api/axios";

// Obtener todos los videos
async function getAllVideos() {
  try {
    const response = await api.get(`/video/`);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

// Obtener video por ID
async function getVideoById(id) {
  try {
    const response = await api.get(`/video/${id}`);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

// Obtener videos por destino
async function getVideosByDestination(idDestination) {
  try {
    const response = await api.get(`/video/destination/${idDestination}`);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

// Obtener videos paginados
async function getVideosPaginated(page = 1, limit = 2, idDestination = null) {
  try {
    let url = `/video/paginated?page=${page}&limit=${limit}`;
    if (idDestination) {
      url += `&idDestination=${idDestination}`;
    }

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

// Crear video
async function createVideo(formData) {
  try {
    const response = await api.post(`/video/`, formData);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

// Actualizar video
async function updateVideo(id, formData) {
  try {
    const response = await api.put(`/video/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

// Eliminar video
async function deleteVideo(id) {
  try {
    const response = await api.delete(`/video/${id}`);
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function reorderDestinations(destinationId, newOrder) {
  try {
    const response = await api.put(`/video/reorder`, { destinationId, newOrder });
    return response.data;
  } catch (error) {
    console.error("Network error:", error);
    return error.response?.data || { ok: false, message: "Network error" };
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
