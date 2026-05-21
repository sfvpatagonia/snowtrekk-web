import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import activityService from "../services/activities";

export const fetchActivities = createAsyncThunk(
  "activities/fetchActivities",
  async () => {
    const response = await activityService.getActivities();
    return response.body.activities;
  }
);

const activitySlice = createSlice({
  name: "activities",
  initialState: {
    activities: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload !== null) {
          state.activities = action.payload;
        }
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default activitySlice.reducer;
