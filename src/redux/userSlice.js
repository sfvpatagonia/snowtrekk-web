import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  email: "",
  isAdmin: false,
  isSuperAdmin: false,
  name: "",
  lastName: "",
  blocked: false,
  hasShop: false,
  birthDate: "",
  phone: "",
  shops: [],
  purchases: 0,
  reviews: 0,
  favorites: 0,
  claims: 0,
  Images: [],
  token: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      const {
        id,
        email,
        isAdmin,
        isSuperAdmin,
        name = "",
        lastName = "",
        blocked = false,
        hasShop = false,
        birthDate = "",
        phone = "",
        shops = [],
        purchases = 0,
        favorites = 0,
        reviews = 0,
        claims = 0,
        Images = [],
        token = "",
      } = action.payload;

      state.id = id;
      state.email = email;
      state.isAdmin = isAdmin;
      state.isSuperAdmin = isSuperAdmin;
      state.name = name;
      state.lastName = lastName;
      state.blocked = blocked;
      state.hasShop = hasShop;
      state.birthDate = birthDate;
      state.phone = phone;
      state.shops = shops;
      state.purchases = purchases;
      state.favorites = favorites;
      state.reviews = reviews;
      state.claims = claims;
      state.token = token;
      state.Images = Images;
    },
    changeName: (state, action) => {
      state.name = action.payload;
    },
    checkAdmin: (state, action) => {
      const { isAdmin } = action.payload;
      state.isAdmin = isAdmin;
    },
    logout: (state) => {
      sessionStorage.removeItem("token");
      state = initialState;
      return state;
    },
  },
});

export const { addUser, changeName, checkAdmin, logout } = userSlice.actions;
export default userSlice.reducer;
