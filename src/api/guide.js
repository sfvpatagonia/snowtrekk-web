import axios from "./axios";

export const getCountriesGuide = async () => {
  try {
    const response = await axios.get(`/country/guide/`);
    return response.data;
  } catch {
    console.error(error.response);
    console.error(error.request);
    console.error(error.message);
  }
};

export const getGuideAreas = async () => {
  try {
    const response = await axios.get(`/area/guide/`);
    return response.data;
  } catch (error) {
    console.error(error.response);
    console.error(error.request);
    console.error(error.message);
  }
};

export const getGuideRegions = async () => {
  try {
    const response = await axios.get(`/region/guide/`);
    return response.data;
  } catch (error) {
    console.error(error.response);
    console.error(error.request);
    console.error(error.message);
  }
};

export const getGuideCities = async () => {
  let url = "/city/guide";
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error.response);
    console.error(error.request);
    console.error(error.message);
  }
};

export const getGuideDestinations = async () => {
  let url;
  try {
    url = `/destination/guide/`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error.response);
    console.error(error.request);
    console.error(error.message);
  }
};
