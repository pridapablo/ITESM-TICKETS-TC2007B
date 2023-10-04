import { dataProvider } from "./data/dataProvider";
import { TicketCreate, TicketEdit, TicketList } from "./resources/tickets";
import { CustomLayout } from "./layout/CustomLayout";
import { i18nProvider } from "./locale/i18nProvider";
import MyLoginPage from "./auth/MyLoginPage";
import { authProvider } from "./auth/authProvider";
import NoteIcon from "@mui/icons-material/Note";
import { Admin, Resource } from "react-admin";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import usePersistentState from "./hooks/usePersistentState";
import { useTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light"
  }
});

const darkTheme = createTheme({
  palette: {
    mode: "dark"
  }
});

export const App = () => {
  const [currentTheme, setCurrentTheme] = usePersistentState<'light' | 'dark'>('theme', 'light');
  const theme = useTheme();

  return (
    <ThemeProvider theme={currentTheme === 'light' ? lightTheme : darkTheme}>
      <Admin
        dataProvider={dataProvider}
        layout={CustomLayout}
        darkTheme={darkTheme}
        i18nProvider={i18nProvider}
        authProvider={authProvider}
        loginPage={MyLoginPage}
      >
        <Resource
          name="ticket"
          options={{ label: 'resources.tickets' }}
          list={TicketList}
          edit={TicketEdit}
          create={TicketCreate}
          icon={NoteIcon}
        />
      </Admin>
    </ThemeProvider>
  );
};
