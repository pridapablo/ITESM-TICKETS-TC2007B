import {
    Datagrid,
    List,
    ReferenceField,
    TextField,
    EditButton,
    Edit,
    SimpleForm,
    TextInput,
    Create,
    NumberInput,
    DateField,
    DateInput,
    SelectInput
} from "react-admin";
import { useSuccessHandler } from "../hooks/successHandlers";

export const TicketList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="classification" />
            <TextField source="type" />
            <TextField source="priority" />
            <TextField source="resolutionID" />
            <DateField source="closureTime" />
            <EditButton />
        </Datagrid>
    </List>
);

export const TicketEdit = () => {
    const onSuccess = useSuccessHandler("Ticket updated", "/tickets");
    return (
        <Edit mutationOptions={{ onSuccess }}>
            <SimpleForm warnWhenUnsavedChanges>
                <SelectInput
                    source="classification"
                    choices={[
                        { id: 'Servicios', name: 'Servicios' },
                        // ... Agrega el resto de las clasificaciones aquí
                    ]}
                />
                <SelectInput
                    source="type"
                    choices={[
                        { id: 'Agua', name: 'Agua' },
                        // ... Agrega el resto de los tipos aquí
                    ]}
                />
                <NumberInput source="priority" />
                <TextInput source="resolutionID" />
                <DateInput source="closureTime" />
            </SimpleForm>
        </Edit>
    );
};

export const TicketCreate = () => {
    const onSuccess = useSuccessHandler("Ticket created", "/tickets");
    return (
        <Create mutationOptions={{ onSuccess }}>
            <SimpleForm warnWhenUnsavedChanges>
                <SelectInput
                    source="classification"
                    choices={[
                        { id: 'Servicios', name: 'Servicios' },
                        // ... Agrega el resto de las clasificaciones aquí
                    ]}
                />
                <SelectInput
                    source="type"
                    choices={[
                        { id: 'Agua', name: 'Agua' },
                        // ... Agrega el resto de los tipos aquí
                    ]}
                />
                <NumberInput source="priority" />
                <TextInput source="resolutionID" />
                <DateInput source="closureTime" />
            </SimpleForm>
        </Create>
    );
};
