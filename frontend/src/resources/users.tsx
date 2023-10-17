// src/users.tsx
import {useState,useEffect} from 'react'
import { useMediaQuery, Theme } from "@mui/material";
import {
  List,
  SimpleList,
  Datagrid,
  TextField,
  FunctionField,
  EditButton,
  Edit,
  SimpleForm,
  TextInput,
  PasswordInput,
  Create,
  SelectInput,
  useTranslate,
} from "react-admin";

import MyUrlField from "../components/MyUrlField";
import { useSuccessHandler } from '../hooks/successHandlers';


export const UserList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  const renderRoleField = (record: any) => {
    let roleText = record.role;
    if (record.role === 'agent') {
      roleText = 'coordinador nacional';
    } else if (record.role === 'user') {
      roleText = 'coordinador de aula';
    }
    return roleText;
  };

  const translate = useTranslate();

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
          <TextField source="username" label={translate('resources.user.fields.username')} />
          <FunctionField render={renderRoleField} source='role' label={translate('resources.user.fields.role')} />
          <TextField source="phone" label={translate('resources.user.fields.phone')} />
          <EditButton />
        </Datagrid>
      )}
    </List>
  );
};



export const UserEdit = () => {
  const translate = useTranslate();

  return (
  <Edit>
    <SimpleForm warnWhenUnsavedChanges>
      <TextInput source="id" disabled label={translate('resources.user.fields.id')} />
      <TextInput source="username" label={translate('resources.user.fields.username')} />
      <PasswordInput source='pwdHash' label={translate('resources.user.fields.password')} />
      <TextInput source="phone" label={translate('resources.user.fields.phone')} />
    </SimpleForm>
  </Edit>
  )
};


export const UserCreate = () => {
  const [selectedRol, setSelectedRol] = useState('');
  const onSuccess = useSuccessHandler("User Created", '/user/create')
  const roles = ["admin", "agent", "user"];

  const handleRolChange = (event:any) => {
    setSelectedRol(event.target.value);
  }

  const translate = useTranslate();

  return (
    <Create mutationOptions={{onSuccess}}>
      <SimpleForm warnWhenUnsavedChanges>
        <TextInput source="username"  autoComplete='off' label={translate('resources.user.fields.username')} />
        <SelectInput 
          source="role"
          label={translate('resources.user.fields.role')}
          choices={roles.map(role => ({id:role,name: role }))}
          onChange={handleRolChange}
          value={selectedRol}
        />
        <TextInput source="phone" autoComplete='off' label={translate('resources.user.fields.phone')} />
        <PasswordInput source="pwdHash" label={translate('resources.user.fields.password')} />
      </SimpleForm>
    </Create>
  );
};
