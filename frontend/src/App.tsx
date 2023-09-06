import { Admin, Resource } from "react-admin";
import { dataProvider } from "./data/dataProvider";
import { UserCreate, UserEdit, UserList } from "./resources/users";
import { PostCreate, PostEdit, PostList } from "./resources/posts";
import { AlbumCreate, AlbumEdit, AlbumList } from "./resources/albums";
import { CustomLayout } from "./layout/CustomLayout";
import i18nProvider from "./locale/i18nProvider";

export const App = () => {
  return (
    <Admin
      dataProvider={dataProvider}
      layout={CustomLayout}
      darkTheme={{ palette: { mode: "dark" } }}
      i18nProvider={i18nProvider}
    >
      <Resource
        name="posts"
        list={PostList}
        edit={PostEdit}
        create={PostCreate}
      />
      <Resource
        name="users"
        list={UserList}
        edit={UserEdit}
        create={UserCreate}
      />
      <Resource
        name="albums"
        list={AlbumList}
        edit={AlbumEdit}
        create={AlbumCreate}
      />
    </Admin>
  );
};
