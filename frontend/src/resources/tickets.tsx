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
  Filter,
  ListProps,
  WithListContext,
  useRecordContext,
  useTranslate,
  useListContext,
  required,
  FieldProps,
  BooleanField,
} from "react-admin";
import { useSuccessHandler } from "../hooks/successHandlers";
import TicketCards from "../components/card";
import React, { useEffect, useState } from "react";
import ToggleButtons from "../components/toggleButton";
import { Chip } from '@mui/material';

const menu = [
  "Servicios",
  "Digital",
  "Infraestructura",
  "Recursos Humanos",
  "Beneficiarios",
  "Mobiliario",
  "Seguridad",
  "Materiales",
  "Fenómeno meteorológico",
];
const subMenu = {
  Servicios: ["Agua", "Luz", "Teléfono", "Basura", "Limpeza del Aula"],
  Digital: [
    "Internet",
    "Servidores y Equipos",
    "Software",
    "Hardware",
    "Cámaras de Seguridad",
    "Soporte Técnico Presencial y Remoto",
  ],
  Infraestructura: [
    "Paredes",
    "Techo",
    "Ventanas",
    "Puertas",
    "Aulas en general",
  ],
  "Recursos Humanos": [
    "Permisos",
    "Asistencias",
    "Salud",
    "Trámites",
    "Honorarios",
    "Asistencias",
  ],
  Beneficiarios: [
    "Asistencias",
    "Documentación",
    "Apoyo Académico",
    "Salud",
    "Seguridad/Bullying",
  ],
  Mobiliario: [
    "Sillas/Butacas",
    "Escritorios",
    "Pizarrones",
    "Cafetería",
    "Estantes/Archiveros",
  ],
  Seguridad: ["Delincuencia", "Robos", "Bandalismo", "Imagen Institucional"],
  Materiales: ["Educativos", "Papelería", "Limpieza"],
  "Fenómeno meteorológico": ["Inundaciones", "Incendios", "Sismos"],
};

interface TicketRecord {
  priority: number;
  status: number;
  resolution: {
    closureTime: Date;
  };
}

const menuChoices = menu.map((item) => ({ id: item, name: item }));

interface QuickFilterProps {
  label: string;
  source: string;
  defaultValue: any;
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
  const PriorityField: React.FC<FieldProps<TicketRecord>> = (props) => {
    const record = useRecordContext(props);
    const translate = useTranslate();
    const priorities = translate('resources.ticket.fields.priorities').split(',');
    return record ? (
      <TextField
        {...props}
        record={{
          ...record,
          priority: priorities[record.priority - 1],
        }}
      />
    ) : null;
  };

  const StatusField: React.FC<FieldProps<TicketRecord>> = (props) => {
    const record = useRecordContext(props);
    const translate = useTranslate();
    const statuses = translate('resources.ticket.fields.statuses').split(',');
    return record ? (
      <TextField
        {...props}
        record={{ ...record, status: statuses[record.status - 1] }}
      />
    ) : null;
  };

  const ClosureTimeField: React.FC<FieldProps<TicketRecord>> = (props) => {
    const record = useRecordContext(props);
    return record && record.resolution && record.resolution.closureTime ? (
      <DateField {...props} source="resolution.closureTime" />
    ) : (
      <span>✖</span>
    );
  };
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
      <ToggleButtons
        handleClick1={toggleListView}
        handleClick2={toggleCardView}
      />
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
          <PriorityField source="priority" label={translate('resources.ticket.fields.priority')} />
          <StatusField source="status" label={translate('resources.ticket.fields.status')} />
          <ClosureTimeField
            source="resolution.closureTime"
            label={translate('resources.ticket.fields.closureTime')}
          />
          <BooleanField source="isDeleted" label={translate('resources.ticket.fields.isDeleted')} />
          <EditButton />
        </Datagrid>
      )}
    </List>
  );
};

export const TicketEdit = () => {
  const role = localStorage.getItem("role") || "";
  const canEditResolution = ["admin", "agent"].includes(role);

  interface StatusIndicatorProps {
    showText?: boolean;
  }
  const StatusIndicator: React.FC<StatusIndicatorProps> = ({
    showText = false,
  }) => {
    const record = useRecordContext();
    const translate = useTranslate();
    const statuses = translate('resources.ticket.fields.statuses').split(',');

    const getStatusText = (status: Number) => {
      switch (status) {
        case 1:
          return statuses[0];
        case 2:
          return statuses[1];
        case 3:
          return statuses[2];
        case 4:
          return statuses[3];
        case 5:
          return statuses[4];
        default:
          return statuses[5];
      }
    };

    const statusText = record.isDeleted
      ? `${translate('resources.ticket.fields.ticketDeleted')} ${getStatusText(record.status)}`
      : getStatusText(record.status);

    return (
      <div className="status-container flex flex-col items-center p-4">
        <div
          className={`status-indicator ${record.isDeleted
            ? "bg-red-500"
            : record.status === 5
              ? "bg-green-500"
              : "bg-gray-500"
            } p-4 rounded-full mb-4 shadow-lg transition-all duration-300`}
        />
        {showText && (
          <span className="status-text text-sm font-bold mb-2">
            {statusText}
          </span>
        )}
      </div>
    );
  };

  const MainFields = () => {
    const role = localStorage.getItem("role") || "";
    const userID = localStorage.getItem("userID") || "";
    const record = useRecordContext();

    const userCreatedThisTicket =
      record.creator && record.creator._id === userID;

    const canEdit =
      role === "user" ||
      (["admin", "agent"].includes(role) && userCreatedThisTicket);

    const translate = useTranslate();

    return (
      <div className="flex flex-row justify-between gap-6">
        <div className="flex flex-col">
          <ContextDropdown
            view={!canEdit || record.status === 5 || record.isDeleted}
          />
          <TextInput
            source="description"
            multiline
            disabled={!canEdit || record.status === 5 || record.isDeleted}
            validate={required()}
          />
          {record.folio && (
            <TextInput 
              source="folio" 
              label={translate('resources.ticket.fields.folio')}
              disabled={true} 
            />
          )}
          {record.responsible && (
            <TextInput
              source="responsible"
              label={translate('resources.ticket.fields.responsible')}
              disabled={true}
            />
          )}
          {record.topic && (
            <TextInput 
              source="topic" 
              label={translate('resources.ticket.fields.topic')}
              disabled={true} 
            />
          )}
          <SelectInput
            source="priority"
            choices={[
              { id: "1", name: "Muy baja" },
              { id: "2", name: "Baja" },
              { id: "3", name: "Media" },
              { id: "4", name: "Alta" },
              { id: "5", name: "Muy alta" },
            ]}
            validate={required()}
            disabled={!canEdit || record.status === 5 || record.isDeleted}
          />
        </div>
        <div className="flex flex-col">
          <TicketCards {...record} isView />
          {!["admin", "agent"].includes(role) ||
            record.status === 5 ||
            record.isDeleted ? (
            <StatusIndicator showText />
          ) : (
            <div className="status-container flex flex-row items-center">
              <StatusDropdown />
              <StatusIndicator />
            </div>
          )}
        </div>
      </div>
    );
  };

  const StatusDropdown = () => {
    const role = localStorage.getItem("role") || "";
    const userID = localStorage.getItem("userID") || "";
    const record = useRecordContext();

    const userCreatedThisTicket =
      record.creator && record.creator._id === userID;

    const canEditStatus =
      ["admin", "agent"].includes(role) ||
      (role === "user" && userCreatedThisTicket);

      const translation = useTranslate();

      const statuses = translation('resources.ticket.fields.statuses').split(',');

    return record.status !== 5 ? (
      <SelectInput
        source="status"
        choices={[
          { id: "1", name: statuses[0] },
          { id: "2", name: statuses[1] },
          { id: "3", name: statuses[2] },
          { id: "4", name: statuses[3] },
          { id: "5", name: statuses[4] },
        ]}
        validate={required()}
        disabled={!canEditStatus || record.isDeleted}
      />
    ) : null;
  };

  const ContextDropdown = ({ view }: { view?: boolean }) => {
    const [subChoices, setSubChoices] = useState<
      { id: string; name: string }[]
    >([]);
    const record = useRecordContext();

    const handleClassificationChange = (event: any) => {
      const selectedClassification = event.target.value as keyof typeof subMenu;
      setSubChoices(
        subMenu[selectedClassification].map((item) => ({
          id: item,
          name: item,
        }))
      );
    };

    useEffect(() => {
      if (record && record.classification) {
        const selectedClassification =
          record.classification as keyof typeof subMenu;
        if (subMenu[selectedClassification]) {
          setSubChoices(
            subMenu[selectedClassification].map((item) => ({
              id: item,
              name: item,
            }))
          );
        }
      }
    }, [record]);

    return (
      <>
        <SelectInput
          source="classification"
          choices={menuChoices}
          disabled={view || record.status === 5 || record.isDeleted}
          onChange={handleClassificationChange}
          validate={required()}
        />
        <SelectInput
          source="subclassification"
          choices={subChoices}
          disabled={view || record.status === 5 || record.isDeleted}
          validate={required()}
        />
      </>
    );
  };

  const Resolution = (props: { canEdit: boolean }) => {
    const record = useRecordContext();
    const [isSolved, setIsSolved] = useState(record.status === 5);

    useEffect(() => {
      setIsSolved(record.status === 5);
    }, [record]);

    const handleIsSolvedChange = () => {
      const nextIsSolved = !isSolved;

      // Set the state of isSolved
      setIsSolved(nextIsSolved);

      // If nextIsSolved is false and there's a resolution record, reset it.
      if (!nextIsSolved && record.resolution) {
        console.log("resetting resolution fields");

        // Reset the fields of the resolution object
        const resetFields = [
          "closureTime",
          "whatWasDone",
          "howWasDone",
          "whyWasDone",
        ];
        resetFields.forEach((field) => {
          if (record.resolution[field]) {
            record.resolution[field] = undefined;
          }
        });
      }
    };

    const translate = useTranslate();

    return (
      <>
        <BooleanInput
          source="isSolved"
          label={translate('resources.ticket.fields.isSolved')}
          onChange={handleIsSolvedChange}
          value={isSolved}
          // Allow editing only if canEdit prop is true and the record status is not 5.
          disabled={!props.canEdit || record.status === 5 || record.isDeleted}
        />

        {isSolved && (
          <>
            <DateInput
              source="resolution.closureTime"
              label={translate('resources.ticket.fields.closureTime')}
              // Allow editing only if canEdit prop is true and the record status is not 5.
              disabled={
                !props.canEdit || record.status === 5 || record.isDeleted
              }
            />
            <TextInput
              source="resolution.whatWasDone"
              label={translate('resources.ticket.fields.whatWasDone')}
              disabled={
                !props.canEdit || record.status === 5 || record.isDeleted
              }
            />
            <TextInput
              source="resolution.howWasDone"
              label={translate('resources.ticket.fields.howWasDone')}
              disabled={
                !props.canEdit || record.status === 5 || record.isDeleted
              }
            />
            <TextInput
              source="resolution.whyWasDone"
              label={translate('resources.ticket.fields.whyWasDone')}
              disabled={
                !props.canEdit || record.status === 5 || record.isDeleted
              }
            />
          </>
        )}
      </>
    );
  };

  return (
    <Edit>
      <SimpleForm warnWhenUnsavedChanges>
        <MainFields />
        <Resolution canEdit={canEditResolution} />
      </SimpleForm>
    </Edit>
  );
};

export const TicketCreate = () => {
  const [typeChoices, setTypeChoices] = useState<
    { id: string; name: string }[]
  >([]);
  const onSuccess = useSuccessHandler("Ticket creado", "/ticket");

  const handleClassificationChange = (event: any) => {
    const selectedClassification = event.target.value as keyof typeof subMenu;
    setTypeChoices(
      subMenu[selectedClassification].map((item) => ({ id: item, name: item }))
    );
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
          validate={required()}
        />
        <SelectInput
          source="subclassification"
          label={translate('resources.ticket.fields.subclassification')}
          choices={typeChoices}
          validate={required()}
        />

        <TextInput
          source="description"
          label={translate('resources.ticket.fields.description')}
          multiline
          validate={required()}
        />
        <SelectInput
          source="priority"
          validate={required()}
          label={translate('resources.ticket.fields.priority')}
          choices={[
            { id: "1", name: "Muy baja" },
            { id: "2", name: "Baja" },
            { id: "3", name: "Media" },
            { id: "4", name: "Alta" },
            { id: "5", name: "Muy alta" },
          ]}
        />

        <TextInput source="folio" label="Folio" />
        <SelectInput
          source="responsible"
          label={translate('resources.ticket.fields.responsible')}
          choices={[
            { id: "Presidenta", name: "Presidenta" },
            {
              id: "Coordinacion General de Aulas",
              name: "Coordinacion General de Aulas",
            },
            {
              id: "Coordinacion de Aula Ecatepec",
              name: "Coordinacion de Aula Ecatepec",
            },
            {
              id: "Coordinacion de Aula Cuautitlan",
              name: "Coordinacion de Aula Cuautitlan",
            },
            {
              id: "Coordinacion de Aula Mazatlan",
              name: "Coordinacion de Aula Mazatlan",
            },
            {
              id: "Coordinacion de Aula Guasave",
              name: "Coordinacion de Aula Guasave",
            },
            {
              id: "Coordinacion de Aula Digital",
              name: "Coordinacion de Aula Digital",
            },
            {
              id: "Coordinacion de Administracion",
              name: "Coordinacion de Administracion",
            },
            {
              id: "Coordinacion de Educacion",
              name: "Coordinacion de Educacion",
            },
            {
              id: "Coordinacion de Alianzas",
              name: "Coordinacion de Alianzas",
            },
            {
              id: "Coordinacion de comunicacion",
              name: "Coordinacion de comunicacion",
            },
            {
              id: "Coordinacion de proyectos y procuracion de fondos",
              name: "Coordinacion de proyectos y procuracion de fondos",
            },
          ]}
        />
        <SelectInput
          source="topic"
          label={translate('resources.ticket.fields.topic')}
          choices={[
            { id: "Mobiliario", name: "Mobiliario" },
            { id: "Digital", name: "Digital" },
            { id: "Bitácora de registro", name: "Bitácora de registro" },
            {
              id: "Seguimiento a beneficiarios",
              name: "Seguimiento a beneficiarios",
            },
            { id: "Mantenimiento", name: "Mantenimiento" },
            { id: "Incidencias de personal", name: "Incidencias de personal" },
            { id: "Trámites a gobierno", name: "Trámites a gobierno" },
            { id: "Trámites a empresas", name: "Trámites a empresas" },
            { id: "Profesores INEA", name: "Profesores INEA" },
            { id: "Profesores Conalep", name: "Profesores Conalep" },
            { id: "Conocer", name: "Conocer" },
            { id: "Microsoft", name: "Microsoft" },
            { id: "Insumos", name: "Insumos" },
            { id: "Alianzas", name: "Alianzas" },
            { id: "Infraestructura", name: "Infraestructura" },
            { id: "Seguridad", name: "Seguridad" },
            { id: "Reporte meteorológico", name: "Reporte meteorológico" },
          ]}
        />
      </SimpleForm>
    </Create>
  );
};
