import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCountry: "",
  selectedArea: "",
  selectedRegion: "",
  selectedCity: "",
  selectedDestination: "",
  selectedActivity: "",
};

export const guideSlice = createSlice({
  name: "guide",
  initialState,
  reducers: {
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
    },
    setSelectedArea: (state, action) => {
      state.selectedArea = action.payload;
    },
    setSelectedRegion: (state, action) => {
      state.selectedRegion = action.payload;
    },
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
    setSelectedDestination: (state, action) => {
      state.selectedDestination = action.payload;
    },
    setSelectedActivity: (state, action) => {
      state.selectedActivity = action.payload;
    },
  },
});

export const {
  setSelectedCountry,
  setSelectedRegion,
  setSelectedArea,
  setSelectedCity,
  setSelectedDestination,
  setSelectedActivity,
} = guideSlice.actions;

export default guideSlice.reducer;
