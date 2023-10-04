import {
    Datagrid,
    List,
    TextField,
    EditButton,
    Edit,
    SimpleForm,
    TextInput,
    Create,
    DateField,
    DateInput,
    SelectInput,
    BooleanInput,
    maxValue,
    Filter,
    ListProps,
} from "react-admin";
import { useSuccessHandler } from "../hooks/successHandlers";
import React, {  useState } from "react";

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

export const TicketList: React.FC<ListProps> = (props) => (
    <List {...props}
        filterDefaultValues={{ isDeleted: true }}
        filters={
            <Filter>
                <BooleanInput label="Ocultar eliminados" source="isDeleted" alwaysOn />
            </Filter>
        }
    >
        <Datagrid>
            <TextField source="id" />
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
    const [typeChoices, setTypeChoices] = useState<{ id: string, name: string }[]>([]);
    const [isSolved, setIsSolved] = useState(false);
    const onSuccess = useSuccessHandler("Ticket actualizado", "/ticket");

    const handleClassificationChange = (event: any) => {
        const selectedClassification = event.target.value as keyof typeof subMenu;
        setTypeChoices(subMenu[selectedClassification].map(item => ({ id: item, name: item })));
    };

    const handleIsSolvedChange = (event: any) => {
        setIsSolved(event.target.checked);
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
                    source="subclassification"
                    choices={typeChoices}
                />
                <TextInput source="description" multiline />
                <SelectInput source="priority" choices={[
                    { id: '1', name: 'Muy baja' },
                    { id: '2', name: 'Baja' },
                    { id: '3', name: 'Media' },
                    { id: '4', name: 'Alta' },
                    { id: '5', name: 'Muy alta' },
                ]} />
                <BooleanInput source="isSolved" label="Is Solved" onChange={handleIsSolvedChange} />
                {isSolved &&
                    <>
                        <DateInput 
                            source="resolution.closureTime" 
                            label="Closure Time" 
                            defaultValue={new Date().toISOString()}
                            validate={maxValue(new Date().toISOString(), "El ticket no puede cerrarse en el futuro")}
                        />
                        <TextInput source="resolution.whatWasDone" label="What Was Done" />
                        <TextInput source="resolution.howWasDone" label="How Was Done" />
                        <TextInput source="resolution.whyWasDone" label="Why Was Done" />
                    </>
                }
                
            </SimpleForm>
        </Edit>
    );
};


export const TicketCreate = () => {
    const [typeChoices, setTypeChoices] = useState<{ id: string, name: string }[]>([]);
    const onSuccess = useSuccessHandler("Ticket creado", "/ticket");

    const handleClassificationChange = (event: any) => {
        const selectedClassification = event.target.value as keyof typeof subMenu;
        setTypeChoices(subMenu[selectedClassification].map(item => ({ id: item, name: item })));
    };
    const userID = localStorage.getItem('userID');

    return (
        <Create mutationOptions={{ onSuccess }}>
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
                <TextInput source="userID" label="User ID" defaultValue={userID} disabled />
            </SimpleForm>
        </Create>
    );
};