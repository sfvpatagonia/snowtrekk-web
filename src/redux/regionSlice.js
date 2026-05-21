import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getGuideRegions } from "../api/guide";

export const fetchRegions = createAsyncThunk(
  "regions/fetchRegions",
  async () => {
    const response = await getGuideRegions();
    return response.body.regions;
  }
);

const regionSlice = createSlice({
  name: "regions",
  initialState: {
    regions: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload !== null) {
          state.regions = action.payload;
        }
      })
      .addCase(fetchRegions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default regionSlice.reducer;
