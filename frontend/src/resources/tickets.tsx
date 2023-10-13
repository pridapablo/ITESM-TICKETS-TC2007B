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
  useRecordContext,
  useTranslate,
  useListContext,
} from "react-admin";
import { useSuccessHandler } from "../hooks/successHandlers";
import TicketCards from "../components/card";
import React, { useEffect, useState } from "react";
import ToggleButtons from "../components/toggleButton";
import { Chip } from '@mui/material';

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

interface QuickFilterProps {
  label: string;
  source: string;
  defaultValue: any;  // O un tipo más específico si sabes lo que debería ser
}

interface FilterValues {
  [key: string]: string | number | boolean;
}

const QuickFilter: React.FC<QuickFilterProps> = ({ label, source, defaultValue }) => {
  const translate = useTranslate();
  const { filterValues, setFilters } = useListContext();

  const handleClick = () => {
    const newFilterValue = filterValues[source] ? false : true;

    setFilters(
      { ...filterValues, [source]: newFilterValue },
      { ...filterValues, [source]: true }
    );
  };


  const isActive = filterValues[source] === defaultValue;

  return (
    <Chip
      sx={{ marginBottom: 1 }}
      label={translate(label)}
      onClick={handleClick}
      color={isActive ? 'primary' : 'default'}
    />
  );
};

export const TicketList: React.FC<ListProps> = (props) => {
  const [isList, setIsList] = useState(true); // Initialize isList state as true

  const toggleListView = () => {
    setIsList(true); // Toggle the isList state when the button is clicked
  };

  const toggleCardView = () => {
    setIsList(false); // Toggle the isList state when the button is clicked
  };

  const translate = useTranslate();

  return (
    <List
      {...props}
      filterDefaultValues={{ isDeleted: true }}
      filters={
        <Filter>
          <QuickFilter source="isDeleted" label={translate('resources.ticket.fields.hideDeleted')} defaultValue={true} />
          <QuickFilter source="sortByPriority" label={translate('resources.ticket.fields.sortByPriority')} defaultValue={true} />
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
          <TextField source="id" label={translate('resources.ticket.fields.id')} />
          <TextField source="classification" label={translate('resources.ticket.fields.classification')} />
          <TextField source="subclassification" label={translate('resources.ticket.fields.subclassification')} />
          <TextField source="description" label={translate('resources.ticket.fields.description')} />
          <TextField source="priority" label={translate('resources.ticket.fields.priority')} />
          <DateField source="closureTime" label={translate('resources.ticket.fields.closureTime')} />
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


  const ContextDropdown = ({ view }: { view?: boolean }) => {
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

  const translate = useTranslate();

  return (
    <Edit>
      <SimpleForm warnWhenUnsavedChanges>
        <ContextDropdown view={role !== 'user'} />
        <TextInput source="description" multiline />
        <SelectInput source="priority" choices={[
          { id: '1', name: 'Muy baja' },
          { id: '2', name: 'Baja' },
          { id: '3', name: 'Media' },
          { id: '4', name: 'Alta' },
          { id: '5', name: 'Muy alta' },
        ]} />
        <BooleanInput source="isSolved" label={translate('resources.ticket.fields.isSolved')} onChange={handleIsSolvedChange} disabled={role === 'user'} />
        {isSolved &&
          <>
            <DateInput
              source="resolution.closureTime"
              label="Closure Time"
              defaultValue={new Date().toISOString()}
              validate={maxValue(new Date().toISOString(), "El ticket no puede cerrarse en el futuro")}
            />
            <TextInput source="resolution.whatWasDone" label={translate('resources.ticket.fields.whatWasDone')} />
            <TextInput source="resolution.howWasDone" label={translate('resources.ticket.fields.howWasDone')} />
            <TextInput source="resolution.whyWasDone" label={translate('resources.ticket.fields.whyWasDone')} />
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

  const translate = useTranslate();

  return (
    <Create mutationOptions={{ onSuccess }}>
      <SimpleForm warnWhenUnsavedChanges>
        <SelectInput
          source="classification"
          label={translate('resources.ticket.fields.classification')}
          choices={menuChoices}
          onChange={handleClassificationChange}
        />
        <SelectInput
          source="subclassification"
          label={translate('resources.ticket.fields.subclassification')}
          choices={typeChoices}
        />
        <TextInput
          source="description"
          label={translate('resources.ticket.fields.description')}
          multiline
        />
        <SelectInput
          source="priority"
          label={translate('resources.ticket.fields.priority')}
          choices={[
            { id: '1', name: 'Muy baja' },
            { id: '2', name: 'Baja' },
            { id: '3', name: 'Media' },
            { id: '4', name: 'Alta' },
            { id: '5', name: 'Muy alta' },
          ]} />
      </SimpleForm>
    </Create>
  );
};