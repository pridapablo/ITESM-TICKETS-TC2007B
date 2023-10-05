// src/users.tsx
import {useState,useEffect} from 'react'
import { useMediaQuery, Theme } from "@mui/material";
import {
  List,
  SimpleList,
  Datagrid,
  TextField,
  EmailField,
  EditButton,
  Edit,
  SimpleForm,
  TextInput,
  PasswordInput,
  Create,
  SelectInput,
} from "react-admin";

import MyUrlField from "../components/MyUrlField";
import { useSuccessHandler } from '../hooks/successHandlers';

const rol = ["Admin", "Coordinador"]

export const UserList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  return (
    <List>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.name}
          secondaryText={(record) => record.username}
          tertiaryText={(record) => record.email}
        />
      ) : (
        <Datagrid rowClick="show">
          <TextField source="id" />
          <TextField source="name" />
          <EmailField source="email" />
          <TextField source="phone" />
          <MyUrlField source="website" />
          <TextField source="company.name" />
          <EditButton />
        </Datagrid>
      )}
    </List>
  );
};

export const UserEdit = () => (
  <Edit>
    <SimpleForm warnWhenUnsavedChanges>
      <TextInput source="id" disabled />
      <TextInput source="username" />
      <TextInput source="phone" />
    </SimpleForm>
  </Edit>
);

export const UserCreate = () => {
  const [selectedRol, setSelectedRol] = useState([]);
  const onSuccess = useSuccessHandler("User Created", '/user/create')
  const roles = ["Admin", "Coordinador"];

  const handleRolChange = (event:any) => {
    setSelectedRol(event.target.value);
  }

  return (
    <Create mutationOptions={{onSuccess}}>
      <SimpleForm warnWhenUnsavedChanges>
        <TextInput source="username"  autoComplete='off'/>
        <SelectInput 
          source="role"
          label="Rol"
          choices={roles.map(role => ({name: role }))}
          onChange={handleRolChange}
          value={selectedRol}
        />
        <TextInput source="phone" autoComplete='off' />
        <PasswordInput source="pwdHash" label="Password"/>
      </SimpleForm>
    </Create>
  );
};
