import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import es from "./locales/es.json";

export const SUPPORTED_LANGUAGES = ["es", "en"];
export const LANGUAGE_STORAGE_KEY = "snowtrekk_lang";

function detectLanguage() {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (SUPPORTED_LANGUAGES.includes(stored)) return stored;

  const browserLang = navigator.language?.slice(0, 2).toLowerCase();
  if (SUPPORTED_LANGUAGES.includes(browserLang)) return browserLang;

  return "en";
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: detectLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

// Manual selection persists here so it always wins over navigator.language
// on the next load — detectLanguage() checks localStorage first.
export function setLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) return;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  i18n.changeLanguage(lang);
}

export default i18n;
