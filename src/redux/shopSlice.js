import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  id: null,
  currentServiceId: null,
};

export const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    selectShop: (state, action) => {
      const { name, id } = action.payload;

      state.name = name;
      state.id = id;
    },
    selectCurrentService: (state, action) => {
      const id = action.payload;

      state.currentServiceId = id;
    },
  },
});

export const { selectShop, selectCurrentService } = shopSlice.actions;
export default shopSlice.reducer;
