import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCountriesGuide } from "../api/guide";

export const fetchCountries = createAsyncThunk(
  "country/fetchCountries",
  async () => {
    const response = await getCountriesGuide();
    return response.body.countries;
  }
);

const countrySlice = createSlice({
  name: "country",
  initialState: {
    countries: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload !== null) {
          state.countries = action.payload;
        }
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default countrySlice.reducer;
