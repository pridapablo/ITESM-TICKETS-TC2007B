import {
  Create,
  Datagrid,
  Edit,
  EditButton,
  List,
  ReferenceField,
  ReferenceInput,
  SimpleForm,
  TextField,
  TextInput,
} from "react-admin";

export const AlbumList = () => (
  <List>
    <Datagrid>
      <ReferenceField source="userId" reference="users" />
      <TextField source="id" />
      <TextField source="title" />
      <EditButton />
    </Datagrid>
  </List>
);

export const AlbumEdit = () => (
  <Edit>
    <SimpleForm warnWhenUnsavedChanges>
      <ReferenceInput source="userId" reference="users" />
      <TextInput source="id" />
      <TextInput source="title" />
    </SimpleForm>
  </Edit>
);

export const AlbumCreate = () => (
  <Create>
    <SimpleForm warnWhenUnsavedChanges>
      <ReferenceInput source="userId" reference="users" />
      <TextInput source="id" />
      <TextInput source="title" />
    </SimpleForm>
  </Create>
);
