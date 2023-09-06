import {
  Datagrid,
  List,
  ReferenceField,
  TextField,
  EditButton,
  Edit,
  ReferenceInput,
  SimpleForm,
  TextInput,
  Create,
  useUnique
} from "react-admin";
import { useSuccessHandler } from "../hooks/successHandlers";

export const PostList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <ReferenceField source="userId" reference="users" />
      <TextField source="title" />
      <EditButton />
    </Datagrid>
  </List>
);

export const PostEdit = () => {
  const onSuccess = useSuccessHandler("Post updated", "/posts");
  return (
    <Edit mutationOptions={{ onSuccess }}>
      <SimpleForm warnWhenUnsavedChanges>
        <ReferenceInput source="userId" reference="users" />
        <TextInput source="id" />
        <TextInput source="title" />
        <TextInput source="body" />
      </SimpleForm>
    </Edit>
  );
};

export const PostCreate = () => {
  const onSuccess = useSuccessHandler("Post created", "/posts");
  const unique = useUnique();
  return (
    <Create mutationOptions={{ onSuccess }}>
      <SimpleForm warnWhenUnsavedChanges>
        <ReferenceInput source="userId" reference="users" />
        <TextInput source="id" />
        <TextInput source="title" validate={
          unique({message:"El problema ya fue reportado.", debounce:2000})
        } />
        <TextInput source="body" />
      </SimpleForm>
    </Create>
  );
};
