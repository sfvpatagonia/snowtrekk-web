import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getGuideDestinations } from "../api/guide";

export const fetchDestinations = createAsyncThunk(
  "destinations/fetchDestinations",
  async () => {
    const response = await getGuideDestinations();
    return response.body.destinations;
  }
);

const destinationSlice = createSlice({
  name: "destinations",
  initialState: {
    destinations: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDestinations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload !== null) {
          state.destinations = action.payload;
        }
      })
      .addCase(fetchDestinations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default destinationSlice.reducer;
