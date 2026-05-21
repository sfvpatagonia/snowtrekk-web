import { createSlice } from "@reduxjs/toolkit";

// Estado inicial para el token
const initialState = {
  accessToken: "",
  refreshToken: "",
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    // Acción para establecer ambos tokens
    setTokens: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
    // Acción para actualizar el access token
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    // Acción para borrar los tokens
    clearTokens: (state) => {
      state.accessToken = "";
      state.refreshToken = "";
    },
  },
});

// Exportando las acciones del slice
export const { setTokens, updateAccessToken, clearTokens } = tokenSlice.actions;

// Exportando el reducer por defecto
export default tokenSlice.reducer;
