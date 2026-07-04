import axios from "./axios";

export const registerRequest = async (user) =>
  axios.post(`/user/registro`, user);

export const loginRequest = async (user) => axios.post(`/user/login`, user);

export const verifyTokenRequest = async (token) => {
  try {
    const res = await axios.get(`/user/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      return res.data;
    } else {
      return { status: res.status, message: res.data.message };
    }
  } catch (error) {
    console.log(error);
  }
};

export const logOutRequest = async () => axios.post(`/user/logout`);
