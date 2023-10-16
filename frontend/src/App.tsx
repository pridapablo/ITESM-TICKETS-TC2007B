import { dataProvider } from "./data/dataProvider";

import { TicketCreate, TicketEdit, TicketList } from "./resources/tickets";
import {UserList,UserEdit,UserCreate} from './resources/users'

import { CustomLayout } from "./layout/CustomLayout";
import { i18nProvider } from "./locale/i18nProvider";
import MyLoginPage from "./auth/MyLoginPage";
import { authProvider } from "./auth/authProvider";

import NoteIcon from "@mui/icons-material/Note";
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { Admin, ListGuesser, Resource } from "react-admin";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import usePersistentState from "./hooks/usePersistentState";
import { Dashboard } from "./pages/Dashboard";

import './index.css';
import { useState, useEffect } from "react"; // Import useState and useEffect

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
  
  const [role, setRole] = useState(''); // Declare state for role
  const [currentTheme, setCurrentTheme] = usePersistentState<'light' | 'dark'>('theme', 'light');

  useEffect(() => {
    const roleFromLocalStorage = localStorage.getItem('role');
    if (roleFromLocalStorage) {
      setRole(roleFromLocalStorage); 
    } else {
      // window.location.reload(); Ni modo
    }
  }, [role]); 
  
  return (
    <ThemeProvider theme={currentTheme === 'light' ? lightTheme : darkTheme}>
      <Admin
        dataProvider={dataProvider}
        layout={CustomLayout}
        darkTheme={darkTheme}
        i18nProvider={i18nProvider}
        authProvider={authProvider}
        loginPage={MyLoginPage}
        dashboard={Dashboard}
      >
        <Resource
          name="ticket"
          options={{ label: 'resources.tickets' }}
          list={TicketList}
          edit={TicketEdit}
          create={TicketCreate}
          icon={NoteIcon}
        />
        {role == 'user'? null: 
          <Resource
          name="user"
          list={UserList}
          edit={UserEdit}
          create={UserCreate}
          icon={PersonOutlineRoundedIcon}
        />}
      </Admin>
    </ThemeProvider>
  );
};
