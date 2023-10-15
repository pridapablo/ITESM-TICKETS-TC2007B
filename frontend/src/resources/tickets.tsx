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
  required,
} from "react-admin";
import { useSuccessHandler } from "../hooks/successHandlers";
import TicketCards from "../components/card";
import React, { useEffect, useState } from "react";
import ToggleButtons from "../components/toggleButton";

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

const menuChoices = menu.map((item) => ({ id: item, name: item }));

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
      filterDefaultValues={{ isDeleted: true }}
      filters={
        <Filter>
          <BooleanInput
            label="Ocultar eliminados"
            source="isDeleted"
            alwaysOn
          />
          <BooleanInput
            label="Ordenar por prioridad"
            source="sortByPriority"
            alwaysOn
          />
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
  const role = localStorage.getItem("role") || "";
  const canEditResolution = ["admin", "agent"].includes(role);

  const MainFields = () => {
    const role = localStorage.getItem("role") || "";
    const userID = localStorage.getItem("userID") || "";
    const record = useRecordContext();

    const userCreatedThisTicket =
      record.creator && record.creator._id === userID;

    const canEdit =
      role === "user" ||
      (["admin", "agent"].includes(role) && userCreatedThisTicket);

    return (
      <>
        <ContextDropdown view={!canEdit || record.status === 5} />
        <TextInput
          source="description"
          multiline
          disabled={!canEdit || record.status === 5}
        />
        <SelectInput
          source="priority"
          choices={[
            { id: "1", name: "Muy baja" },
            { id: "2", name: "Baja" },
            { id: "3", name: "Media" },
            { id: "4", name: "Alta" },
            { id: "5", name: "Muy alta" },
          ]}
          disabled={!canEdit || record.status === 5}
        />
        <StatusDropdown />
      </>
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

    return record.status !== 5 ? (
      <SelectInput
        source="status"
        choices={[
          { id: "1", name: "Nuevo" },
          { id: "2", name: "Abierto" },
          { id: "3", name: "Pendiente" },
          { id: "4", name: "En Espera" },
        ]}
        disabled={!canEditStatus}
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
          disabled={view || record.status === 5}
          onChange={handleClassificationChange}
        />
        <SelectInput
          source="subclassification"
          choices={subChoices}
          disabled={view || record.status === 5}
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

    return (
      <>
        <BooleanInput
          source="isSolved"
          label="¿Está resuelto?"
          onChange={handleIsSolvedChange}
          value={isSolved}
          // Allow editing only if canEdit prop is true and the record status is not 5.
          disabled={!props.canEdit || record.status === 5}
        />

        {isSolved && (
          <>
            <DateInput
              source="resolution.closureTime"
              label="Closure Time"
              // Allow editing only if canEdit prop is true and the record status is not 5.
              disabled={!props.canEdit || record.status === 5}
            />
            <TextInput
              source="resolution.whatWasDone"
              label="Qué se hizo"
              disabled={!props.canEdit || record.status === 5}
            />
            <TextInput
              source="resolution.howWasDone"
              label="Cómo se hizo"
              disabled={!props.canEdit || record.status === 5}
            />
            <TextInput
              source="resolution.whyWasDone"
              label="Por qué se hizo"
              disabled={!props.canEdit || record.status === 5}
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

  return (
    <Create mutationOptions={{ onSuccess }}>
      <SimpleForm warnWhenUnsavedChanges>
        <SelectInput
          source="classification"
          label="Clasificación"
          choices={menuChoices}
          onChange={handleClassificationChange}
          validate={required()}
        />
        <SelectInput
          source="subclassification"
          label="Subclasificación"
          choices={typeChoices}
          validate={required()}
        />

        <TextInput
          source="description"
          label="Descripción"
          multiline
          validate={required()}
        />
        <SelectInput
          source="priority"
          validate={required()}
          label="Prioridad"
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
          label="Responsable"
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
          label="Asunto"
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
