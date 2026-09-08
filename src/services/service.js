import api from "@/api/axios";

const apiUrl = import.meta.env.VITE_API_URL;

async function createService(newService) {
  try {
    const response = await api.post(`/admin/services/`, newService);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function getFeaturedServices() {
  try {
    const response = await fetch(`${apiUrl}/admin/services/featured/`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

async function getServices(idShop) {
  try {
    const response = await api.get(`/admin/services?idShop=${idShop}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function getServiceById(idService) {
  try {
    const response = await api.get(`/admin/services/${idService}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function changeAvailability(idService, body) {
  try {
    const response = await api.post(
      `/admin/services/${idService}/changeAvailability`,
      body,
    );
    return response.data;
  } catch (error) {
    console.log("error222", error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function toggleServiceVisibility(idService) {
  try {
    const response = await api.put(
      `/admin/services/${idService}/toggleVisibility`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function deleteService(idService) {
  try {
    const response = await api.delete(`/admin/services/${idService}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function updateService(idService, updatedService) {
  try {
    const response = await api.put(`/admin/services/${idService}`, updatedService);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function getServicesByDestinationId(idDestination) {
  try {
    const response = await fetch(
      `${apiUrl}/admin/services/destination/${idDestination}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

async function leaveAQuestion(idService, question) {
  try {
    const response = await api.post(
      `/admin/services/${idService}/question`,
      question,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}
async function leaveAnAnswer(idService, question, answer) {
  try {
    const response = await api.post(
      `/admin/services/${idService}/question/${question}/answer`,
      answer,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

async function deleteQuestion(idService, idQuestion) {
  try {
    const response = await api.delete(
      `/admin/services/${idService}/question/${idQuestion}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { ok: false, message: "Network error" };
  }
}

export default {
  createService,
  getServices,
  getServiceById,
  updateService,
  changeAvailability,
  getServicesByDestinationId,
  getFeaturedServices,
  toggleServiceVisibility,
  deleteService,
  leaveAQuestion,
  leaveAnAnswer,
  deleteQuestion,
};
