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
import { useState } from "react";

const menu = ["Servicios", "Digital", "Infraestructura", "Recursos Humanos", "Beneficiarios", "Mobiliario", "Seguridad", "Materiales", "Fenómeno meteorológico"];
const subMenu = {
    'Servicios': ['Agua', 'Luz', 'Teléfono', 'Basura', 'Limpeza del Aula'],
    'Digital': ['Internet', 'Servidores y Equipos', 'Software', 'Hardware', 'Cámaras de Seguridad', 'Soporte Técnico Presencial y Remoto'],
    'Infraestructura': ['Paredes', 'Techo', 'Ventanas', 'Puertas', 'Aulas en general'],
    'Recursos Humanos': ['Permisos', 'Asistencias', 'Salud', 'Trámites', 'Honorarios', 'Asistencias'],
    'Beneficiarios': ['Asistencias', 'Documentación', 'Apoyo Académico', 'Salud', 'Seguridad/Bullying'],
    'Mobiliario': ['Sillas/Butacas', 'Escritorios', 'Pizarrones', 'Cafetería', 'Estantes/Archiveros'],
    'Seguridad': ['Delincuencia', 'Robos', 'Bandalismo', 'Imagen Institucional'],
    'Materiales': ['Educativos', 'Papelería', 'Limpieza'],
    'Fenómeno meteorológico': ['Inundaciones', 'Incendios', 'Sismos']
};

const menuChoices = menu.map(item => ({ id: item, name: item }));

export const TicketList = () => (
    <List>
        <Datagrid>
            <ReferenceField source="id" reference="tickets" />
            <TextField source="classification" />
            <TextField source="subclassification" />
            <TextField source="priority" />
            <TextField source="resolutionID" />
            <DateField source="closureTime" />
            <EditButton />
        </Datagrid>
    </List>
);

export const TicketEdit = () => {
    const [typeChoices, setTypeChoices] = useState([]);
    const onSuccess = useSuccessHandler("Ticket updated", "/tickets");

    const handleClassificationChange = (event) => {
        const selectedClassification = event.target.value;
        setTypeChoices(subMenu[selectedClassification].map(item => ({ id: item, name: item })));
    };

    return (
        <Edit mutationOptions={{ onSuccess }}>
            <SimpleForm warnWhenUnsavedChanges>
                <SelectInput
                    source="classification"
                    choices={menuChoices}
                    onChange={handleClassificationChange}
                />
                <SelectInput
                    source="type"
                    choices={typeChoices}
                />
                <NumberInput source="priority" />
                <TextInput source="resolutionID" />
                <DateInput source="closureTime" />
            </SimpleForm>
        </Edit>
    );
};

export const TicketCreate = () => {
    const [typeChoices, setTypeChoices] = useState([]);
    const onSuccess = useSuccessHandler("Ticket created", "/ticket");

    const handleClassificationChange = (event) => {
        const selectedClassification = event.target.value;
        setTypeChoices(subMenu[selectedClassification].map(item => ({ id: item, name: item })));
    };

    const userID = localStorage.getItem('userID');

    return (
        <Create mutationOptions={{onSuccess}}>
            <SimpleForm warnWhenUnsavedChanges>
                <SelectInput
                    source="classification"
                    label="Clasificación"
                    choices={menuChoices}
                    onChange={handleClassificationChange}
                />
                <SelectInput
                    source="subclassification"
                    label="Subclasificación"
                    choices={typeChoices}
                />
                <TextInput source="description" label="Descripción" multiline />
                <SelectInput source="priority" label="Prioridad" choices={[
                    { id: '1', name: 'Muy baja' },
                    { id: '2', name: 'Baja' },
                    { id: '3', name: 'Media' },
                    { id: '4', name: 'Alta' },
                    { id: '5', name: 'Muy alta' },
                ]} />
                <TextInput source="userID" label="User ID" defaultValue={userID} disabled/>
            </SimpleForm>
        </Create>
    );
};