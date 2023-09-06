import polyglotI18nProvider from "ra-i18n-polyglot";
import { englishMessages } from "./englishMessages";

// let messages = englishMessages;
// let locale = "en";

// const i18nProvider = {
//   translate: (key: string) => {
//     const translation = lodashGet(messages, key);
//     if (!translation) {
//       console.warn(`Translation not found for key: ${key}`);
//       return key;
//     }
//     return typeof translation === "string" ? translation : "";
//   },
//   changeLocale: (newLocale: string) => {
//     messages = newLocale === "es" ? spanishMessages : englishMessages;
//     locale = newLocale;
//     return Promise.resolve();
//   },
//   getLocale: () => locale,
// };

const i18nProvider = polyglotI18nProvider((locale) => englishMessages, "es");

export default i18nProvider;
