import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalAmount: 0,
  totalQuantity: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.date.date === action.payload.date.date &&
          item.date.time === action.payload.date.time
      );

      if (itemIndex >= 0) {
        state.cartItems[itemIndex].cartQuantity += action.payload.quantity;
      } else {
        const tempProduct = {
          ...action.payload,
          cartQuantity: action.payload.quantity,
        };
        state.cartItems.push(tempProduct);
      }

      state.totalAmount += action.payload.price * action.payload.quantity;
      state.totalQuantity += action.payload.quantity;
    },

    removeFromCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.date.date === action.payload.date.date &&
          item.date.time === action.payload.date.time
      );
      if (itemIndex >= 0) {
        const item = state.cartItems[itemIndex];
        if (item.cartQuantity > action.payload.quantity) {
          item.cartQuantity -= action.payload.quantity;
          state.totalAmount -= item.price * action.payload.quantity;
          state.totalQuantity -= action.payload.quantity;
        } else {
          state.totalAmount -= item.price * item.cartQuantity;
          state.totalQuantity -= item.cartQuantity;
          state.cartItems.splice(itemIndex, 1);
        }
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
