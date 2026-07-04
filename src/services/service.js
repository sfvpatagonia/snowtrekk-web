const apiUrl = import.meta.env.VITE_API_URL;

async function createService(newService, token) {
  try {
    const response = await fetch(`${apiUrl}/admin/services/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: newService,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

async function getFeaturedServices() {
  try {
    const response = await fetch(`${apiUrl}/admin/services/featured/`, {
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

async function getServices(idShop, token) {
  try {
    const response = await fetch(`${apiUrl}/admin/services?idShop=${idShop}`, {
      method: "GET",
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

async function getServiceById(idService, token) {
  try {
    const response = await fetch(`${apiUrl}/admin/services/${idService}`, {
      method: "GET",
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

async function changeAvailability(idService, body, token) {
  try {
    const response = await fetch(
      `${apiUrl}/admin/services/${idService}/changeAvailability`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error222", error);
    return { ok: false, message: "Network error" };
  }
}

async function toggleServiceVisibility(idService, token) {
  try {
    const response = await fetch(
      `${apiUrl}/admin/services/${idService}/toggleVisibility`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

async function deleteService(idService, token) {
  try {
    const response = await fetch(`${apiUrl}/admin/services/${idService}`, {
      method: "DELETE",
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

async function updateService(idService, updatedService, token) {
  try {
    const response = await fetch(`${apiUrl}/admin/services/${idService}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: updatedService,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

async function getServicesByDestinationId(idDestination) {
  try {
    const response = await fetch(
      `${apiUrl}/admin/services/destination/${idDestination}`,
      {
        method: "GET",
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

async function leaveAQuestion(idService, question, token) {
  try {
    const response = await fetch(
      `${apiUrl}/admin/services/${idService}/question`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(question),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}
async function leaveAnAnswer(idService, question, answer, token) {
  try {
    const response = await fetch(
      `${apiUrl}/admin/services/${idService}/question/${question}/answer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(answer),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
  }
}

async function deleteQuestion(idService, idQuestion, token) {
  try {
    const response = await fetch(
      `${apiUrl}/admin/services/${idService}/question/${idQuestion}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Network error" };
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
