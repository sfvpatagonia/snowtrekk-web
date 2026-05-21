import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getGuideAreas } from "../api/guide";

export const fetchAreas = createAsyncThunk("areas/fetchAreas", async () => {
  const response = await getGuideAreas();
  return response.body.areas;
});

const areaSlice = createSlice({
  name: "areas",
  initialState: {
    areas: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAreas.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAreas.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload !== null) {
          state.areas = action.payload;
        }
      })
      .addCase(fetchAreas.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default areaSlice.reducer;
