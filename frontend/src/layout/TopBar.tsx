import {
  AppBar,
  LocalesMenuButton,
  RefreshIconButton,
  ToggleThemeButton,
} from "react-admin";

export const TopBar = () => (
  <AppBar
    toolbar={
      <>
        <LocalesMenuButton />
        <ToggleThemeButton />
        <RefreshIconButton />
      </>
    }
  />
);
