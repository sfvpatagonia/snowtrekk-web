import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import userReducer from "./userSlice.js";
import tokenReducer from "./tokenSlice.js";
import themeReducer from "./themeSlice.js";
import activityReducer from "./activitySlice.js";
import countryReducer from "./countrySlice.js";
import areaReducer from "./areaSlice.js";
import cityReducer from "./citySlice.js";
import guideReducer from "./guideSlice.js";
import regionReducer from "./regionSlice.js";
import destinationReducer from "./destinationSlice";
import shopReducer from "./shopSlice.js";
import cartReducer from "./cartSlice.js";
import cookieReducer from "./cookieSlice.js";

const persistConfig = {
  key: "root",
  storage,
  blacklist: [
    "cookies",
    "countries",
    "activities",
    "areas",
    "cities",
    "destinations",
    "regions",
  ],
};

const rootReducer = combineReducers({
  user: userReducer,
  token: tokenReducer,
  theme: themeReducer,
  countries: countryReducer,
  activities: activityReducer,
  areas: areaReducer,
  cities: cityReducer,
  guide: guideReducer,
  destinations: destinationReducer,
  regions: regionReducer,
  shop: shopReducer,
  cart: cartReducer,
  cookies: cookieReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: true,
});

export const persistor = persistStore(store);
