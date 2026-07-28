import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: null,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    changeTheme: (state, action) => {
      const theme = action.payload ? "dark" : "light";

      if (theme === "light") document.documentElement.classList.remove("dark");
      else document.documentElement.classList.add("dark");

      state.darkMode = action.payload;
    },
  },
});

export const { changeTheme } = themeSlice.actions;

export default themeSlice.reducer;
