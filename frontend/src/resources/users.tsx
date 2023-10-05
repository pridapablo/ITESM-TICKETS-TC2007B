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
          <TextField source="phone" />
          <EditButton />
        </Datagrid>
      )}
    </List>
  );
};



export const UserEdit = () => (

  // TODO: works on backend, no frontend
  <Edit>
    <SimpleForm warnWhenUnsavedChanges>
      <TextInput source="id" disabled />
      <TextInput source="username" />
      <PasswordInput source='pwdHash' label="Password"/>
      <TextInput source="phone" />
    </SimpleForm>
  </Edit>
);


export const UserCreate = () => {
  const [selectedRol, setSelectedRol] = useState('');
  const onSuccess = useSuccessHandler("User Created", '/user/create')
  const roles = ["admin", "agent", "user"];

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
          choices={roles.map(role => ({id:role,name: role }))}
          onChange={handleRolChange}
          value={selectedRol}
        />
        <TextInput source="phone" autoComplete='off' />
        <PasswordInput source="pwdHash" label="Password"/>
      </SimpleForm>
    </Create>
  );
};
