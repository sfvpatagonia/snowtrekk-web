import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getCountries from "../services/getCountries";
import getActivities from "../services/getActivities";
import getAreas from "../services/getAreas";
// import getCities from "../services/getCities";
import { getCities } from "../services/cities";
import getDestinations from "../services/getDestinations";
import getRegions from "../services/getRegions";

// Define acciones asincrónicas para obtener todas las entidades
export const fetchAllEntities = createAsyncThunk(
  "entities/fetchAllEntities",
  async () => {
    const activities = await getActivities();
    const areas = await getAreas();
    const cities = await getCities();
    const countries = await getCountries();
    const destinations = await getDestinations();
    const regions = await getRegions();

    return { activities, areas, cities, countries, destinations, regions };
  }
);

const initialState = {
  activities: [],
  areas: [],
  cities: [],
  countries: [],
  destinations: [],
  regions: [],
  status: "idle", // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
};

export const entitiesSlice = createSlice({
  name: "entities",
  initialState,
  reducers: {
    // Aquí puedes agregar reducers para otras acciones si es necesario
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEntities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllEntities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.activities = action.payload.activities;
        state.areas = action.payload.areas;
        state.cities = action.payload.cities;
        state.countries = action.payload.countries;
        state.destinations = action.payload.destinations;
        state.regions = action.payload.regions;
      })
      .addCase(fetchAllEntities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default entitiesSlice.reducer;
