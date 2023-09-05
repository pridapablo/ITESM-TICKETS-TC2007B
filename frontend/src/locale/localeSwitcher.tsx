import Button from "@mui/material/Button";
import { useLocaleState } from "react-admin";

const LocaleSwitcher = () => {
  const [locale, setLocale] = useLocaleState();
  return (
    <div>
      <div>Language</div>
      <Button
        disabled={locale === "es"}
        onClick={() => {
          setLocale("es");
          console.log("setLocale", locale);
        }}
      >
        English
      </Button>
      <Button disabled={locale === "en"} onClick={() => setLocale("en")}>
        Spanish
      </Button>
    </div>
  );
};

export default LocaleSwitcher;
