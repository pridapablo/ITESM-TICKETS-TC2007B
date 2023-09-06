import { es } from "./spanishMessages";
import { en } from "./englishMessages";
import polyglotI18nProvider from "ra-i18n-polyglot";

const translations = {
  es,
  en,
};

export const i18nProvider = polyglotI18nProvider(
  (locale) => translations[locale],
  "es",
  [
    { locale: "en", name: "English" },
    { locale: "es", name: "Español" },
  ]
);
