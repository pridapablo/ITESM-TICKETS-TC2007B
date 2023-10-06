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
    WithListContext,
} from "react-admin";
import { useSuccessHandler } from "../hooks/successHandlers";
import TicketCards from "../components/card";
import React, {  useState } from "react";
import ToggleButtons from "../components/toggleButton";

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

export const TicketList: React.FC<ListProps> = (props) => {
    const [isList, setIsList] = useState(true); // Initialize isList state as true
  
    const toggleListView = () => {
      setIsList(true); // Toggle the isList state when the button is clicked
    };

    const toggleCardView = () => {
        setIsList(false); // Toggle the isList state when the button is clicked
      };

    
  
    return (
      <List
        {...props}
        filterDefaultValues={{ isDeleted: true}}
        filters={
          <Filter>
            <BooleanInput
              label="Ocultar eliminados"
              source="isDeleted"
              alwaysOn
            />
          </Filter>
        }
      >
        
        <ToggleButtons handleClick1={toggleListView} handleClick2={toggleCardView} />
        {isList ? (
          <WithListContext
            render={({ data }) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ">
                {data?.map((val) => (
                  <TicketCards key={val.id} {...val} />
                ))}
              </div>
            )}
          />
        ) : (
          <Datagrid>
            <TextField source="id" />
            <TextField source="classification" />
            <TextField source="subclassification" />
            <TextField source="description" />
            <TextField source="priority" />
            <DateField source="closureTime" />
            <EditButton />
          </Datagrid>
        )}
      </List>
    
    );
  };

export const TicketEdit = () => {
    const [isSolved, setIsSolved] = useState(false);
    const role = localStorage.getItem('role');

    const handleIsSolvedChange = (event: any) => {
        setIsSolved(event.target.checked);
    };

     {/* TODO: Remove once backend does this */}
    const userID = localStorage.getItem('userID');
    
    const ContextDropdown = ({ view }: { view?: boolean }) => {
        // Todo: create ticket record interface
        const [subChoices, setSubChoices] = useState<{ id: string, name: string }[]>([]);
        const record = useRecordContext();

        const handleClassificationChange = (event: any) => {
            const selectedClassification = event.target.value as keyof typeof subMenu;
            setSubChoices(subMenu[selectedClassification].map(item => ({ id: item, name: item })));
        };

        useEffect(() => {
            if (record && record.classification) {
                const selectedClassification = record.classification as keyof typeof subMenu;
                if (subMenu[selectedClassification]) {
                    setSubChoices(subMenu[selectedClassification].map(item => ({ id: item, name: item })));
                }
            }
        }, [record]);

        
        return (
            <>
                <SelectInput
                source="classification"
                    choices={menuChoices}
                    disabled={view}
                    onChange={handleClassificationChange} />
                <SelectInput
                    source="subclassification"
                    choices={subChoices}
                    disabled={view}
                />
            </>
        );
    }

    return (
        <Edit>
            <SimpleForm warnWhenUnsavedChanges>
                <TextInput source="userID" label="User ID" defaultValue={userID} disabled /> 
                <ContextDropdown view={role !== 'user'} />
                <TextInput source="description" multiline />
                <SelectInput source="priority" choices={[
                    { id: '1', name: 'Muy baja' },
                    { id: '2', name: 'Baja' },
                    { id: '3', name: 'Media' },
                    { id: '4', name: 'Alta' },
                    { id: '5', name: 'Muy alta' },
                ]} />
                <BooleanInput source="isSolved" label="Is Solved" onChange={handleIsSolvedChange} disabled={role === 'user'} />
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
    
    {/* TODO: Remove once backend does this */}
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
                {/* TODO: Remove once backend does this */}
                <TextInput source="userID" label="User ID" defaultValue={userID} disabled /> 
            </SimpleForm>
        </Create>
    );
};