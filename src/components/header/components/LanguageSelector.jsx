import { useTranslation } from "react-i18next";
import { setLanguage, SUPPORTED_LANGUAGES } from "@/i18n";

export default function LanguageSelector({ className = "" }) {
  const { i18n } = useTranslation();

  return (
    <div className={`flex gap-2 ${className}`}>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          className={`cursor-pointer uppercase ${
            i18n.language === lang ? "font-bold underline" : "opacity-60 hover:opacity-100"
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
