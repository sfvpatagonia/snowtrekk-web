import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getGuideCities } from "../api/guide";

export const fetchCities = createAsyncThunk("cities/fetchCities", async () => {
  const response = await getGuideCities();
  return response.body.cities;
});

const citySlice = createSlice({
  name: "cities",
  initialState: {
    cities: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload !== null) {
          state.cities = action.payload;
        }
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default citySlice.reducer;
