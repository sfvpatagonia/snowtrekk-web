import { createSlice } from "@reduxjs/toolkit";

const safeGetStoredConsent = () => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split("; ");
  const found = cookies.find((row) =>
    row.startsWith("snowtrekk_cookie_consent="),
  );

  if (!found) return null;

  try {
    return JSON.parse(decodeURIComponent(found.split("=")[1]));
  } catch {
    return null;
  }
};

const setCookie = (value, days = 365) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `snowtrekk_cookie_consent=${encodeURIComponent(
    JSON.stringify(value),
  )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
};

const initialState = {
  consent: null,
  showBanner: false,
  showPreferences: false,
};

const cookieSlice = createSlice({
  name: "cookies",
  initialState,
  reducers: {
    acceptAll(state) {
      state.consent = {
        necessary: true,
        analytics: true,
        preferences: true,
        marketing: true,
      };
      state.showBanner = false;
      setCookie(state.consent);
    },
    setConsentFromCookie: (state, action) => {
      state.consent = action.payload;
      state.showBanner = !action.payload;
    },
    rejectAll(state) {
      state.consent = {
        necessary: true,
        analytics: false,
        preferences: false,
        marketing: false,
      };
      state.showBanner = false;
      setCookie(state.consent);
    },
    openPreferences(state) {
      state.showPreferences = true;
    },
    closePreferences(state) {
      state.showPreferences = false;
    },
    savePreferences(state, action) {
      state.consent = {
        necessary: true,
        ...action.payload,
      };
      state.showPreferences = false;
      state.showBanner = false;
      setCookie(state.consent);
    },
  },
});

export const {
  acceptAll,
  rejectAll,
  openPreferences,
  closePreferences,
  savePreferences,
  setConsentFromCookie,
} = cookieSlice.actions;

export default cookieSlice.reducer;
