import { Admin, ListGuesser, Resource } from "react-admin";
import { dataProvider } from "./data/dataProvider";
// import { UserCreate, UserEdit, UserList } from "./resources/users";
// import { PostCreate, PostEdit, PostList } from "./resources/posts";
// import { AlbumCreate, AlbumEdit, AlbumList } from "./resources/albums";
// import i18nProvider from "./locale/i18nProvider";
// import LocaleSwitcher from "./locale/localeSwitcher";

export const App = () => {
  return (
    // <Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
    <Admin dataProvider={dataProvider}>
      {/* <Resource
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
      /> */}
      <Resource name="test" list={ListGuesser} />
      {/* <LocaleSwitcher /> */}
    </Admin>
  );
};
