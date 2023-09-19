import { dataProvider } from "./data/dataProvider";
import { UserCreate, UserEdit, UserList } from "./resources/users";
import { PostCreate, PostEdit, PostList } from "./resources/posts";
import { AlbumCreate, AlbumEdit, AlbumList } from "./resources/albums";
import { CustomLayout } from "./layout/CustomLayout";
import { i18nProvider } from "./locale/i18nProvider";
import MyLoginPage from "./auth/MyLoginPage";
import { authProvider } from "./auth/authProvider";
import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import AlbumIcon from "@mui/icons-material/PhotoAlbum";
import React from 'react';
import { Admin, Resource } from "react-admin";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import usePersistentState from "./hooks/usePersistentState";

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
          name="posts"
          options={{ label: 'resources.posts' }}
          list={PostList}
          edit={PostEdit}
          create={PostCreate}
          icon={PostIcon}
        />
        <Resource
          name="users"
          options={{ label: 'resources.users' }}
          list={UserList}
          edit={UserEdit}
          create={UserCreate}
          icon={UserIcon}
        />
        <Resource
          name="albums"
          options={{ label: 'resources.albums' }}
          list={AlbumList}
          edit={AlbumEdit}
          create={AlbumCreate}
          icon={AlbumIcon}
        />
      </Admin>
    </ThemeProvider>
  );
};
