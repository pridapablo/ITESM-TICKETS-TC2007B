import lodashGet from "lodash/get";

import { TranslationMessages } from "ra-core";

const englishMessages: TranslationMessages = {
  ra: {
    action: {
      add_filter: "Add filter",
      add: "Add",
      back: "Go Back",
      bulk_actions: "1 item selected |||| %{smart_count} items selected",
      cancel: "Cancel",
      clear_array_input: "Clear the list",
      clear_input_value: "Clear value",
      clone: "Clone",
      confirm: "Confirm",
      create: "Create",
      create_item: "Create %{item}",
      delete: "Delete",
      edit: "Edit",
      export: "Export",
      list: "List",
      refresh: "Refresh",
      remove_filter: "Remove this filter",
      remove_all_filters: "Remove all filters",
      remove: "Remove",
      save: "Save",
      search: "Search",
      select_all: "Select all",
      select_row: "Select this row",
      show: "Show",
      sort: "Sort",
      undo: "Undo",
      unselect: "Unselect",
      expand: "Expand",
      close: "Close",
      open_menu: "Open menu",
      close_menu: "Close menu",
      update: "Update",
      move_up: "Move up",
      move_down: "Move down",
      open: "Open",
      toggle_theme: "Toggle Theme",
      select_columns: "Columns",
      update_application: "Reload Application",
    },
    boolean: {
      true: "Yes",
      false: "No",
      null: " ",
    },
    page: {
      create: "Create %{name}",
      dashboard: "Dashboard",
      edit: "%{name} %{recordRepresentation}",
      error: "Something went wrong",
      list: "%{name}",
      loading: "Loading",
      not_found: "Not Found",
      show: "%{name} %{recordRepresentation}",
      empty: "No %{name} yet.",
      invite: "Do you want to add one?",
    },
    input: {
      file: {
        upload_several: "Drop some files to upload, or click to select one.",
        upload_single: "Drop a file to upload, or click to select it.",
      },
      image: {
        upload_several: "Drop some pictures to upload, or click to select one.",
        upload_single: "Drop a picture to upload, or click to select it.",
      },
      references: {
        all_missing: "Unable to find references data.",
        many_missing:
          "At least one of the associated references no longer appears to be available.",
        single_missing:
          "Associated reference no longer appears to be available.",
      },
      password: {
        toggle_visible: "Hide password",
        toggle_hidden: "Show password",
      },
    },
    message: {
      about: "About",
      are_you_sure: "Are you sure?",
      auth_error:
        "An error occurred while validating the authentication token.",
      bulk_delete_content:
        "Are you sure you want to delete this %{name}? |||| Are you sure you want to delete these %{smart_count} items?",
      bulk_delete_title: "Delete %{name} |||| Delete %{smart_count} %{name}",
      bulk_update_content:
        "Are you sure you want to update this %{name}? |||| Are you sure you want to update these %{smart_count} items?",
      bulk_update_title: "Update %{name} |||| Update %{smart_count} %{name}",
      clear_array_input: "Are you sure you want to clear the whole list?",
      delete_content: "Are you sure you want to delete this item?",
      delete_title: "Delete %{name} #%{id}",
      details: "Details",
      error: "A client error occurred and your request couldn't be completed.",

      invalid_form: "The form is not valid. Please check for errors",
      loading: "The page is loading, just a moment please",
      no: "No",
      not_found: "Either you typed a wrong URL, or you followed a bad link.",
      yes: "Yes",
      unsaved_changes:
        "Some of your changes weren't saved. Are you sure you want to ignore them?",
    },
    navigation: {
      no_results: "No results found",
      no_more_results:
        "The page number %{page} is out of boundaries. Try the previous page.",
      page_out_of_boundaries: "Page number %{page} out of boundaries",
      page_out_from_end: "Cannot go after last page",
      page_out_from_begin: "Cannot go before page 1",
      page_range_info: "%{offsetBegin}-%{offsetEnd} of %{total}",
      partial_page_range_info:
        "%{offsetBegin}-%{offsetEnd} of more than %{offsetEnd}",
      current_page: "Page %{page}",
      page: "Go to page %{page}",
      first: "Go to first page",
      last: "Go to last page",
      next: "Go to next page",
      previous: "Go to previous page",
      page_rows_per_page: "Rows per page:",
      skip_nav: "Skip to content",
    },
    sort: {
      sort_by: "Sort by %{field} %{order}",
      ASC: "ascending",
      DESC: "descending",
    },
    auth: {
      auth_check_error: "Please login to continue",
      user_menu: "Profile",
      username: "Username",
      password: "Password",
      sign_in: "Sign in",
      sign_in_error: "Authentication failed, please retry",
      logout: "Logout",
    },
    notification: {
      updated: "Element updated |||| %{smart_count} elements updated",
      created: "Element created",
      deleted: "Element deleted |||| %{smart_count} elements deleted",
      bad_item: "Incorrect element",
      item_doesnt_exist: "Element does not exist",
      http_error: "Server communication error",
      data_provider_error: "dataProvider error. Check the console for details.",
      i18n_error: "Cannot load the translations for the specified language",
      canceled: "Action cancelled",
      logged_out: "Your session has ended, please reconnect.",
      not_authorized: "You're not authorized to access this resource.",
      application_update_available: "A new version is available.",
    },
    validation: {
      required: "Required",
      minLength: "Must be %{min} characters at least",
      maxLength: "Must be %{max} characters or less",
      minValue: "Must be at least %{min}",
      maxValue: "Must be %{max} or less",
      number: "Must be a number",
      email: "Must be a valid email",
      oneOf: "Must be one of: %{options}",
      regex: "Must match a specific format (regexp): %{pattern}",
      unique: "Must be unique",
    },
    saved_queries: {
      label: "Saved queries",
      query_name: "Query name",
      new_label: "Save current query...",
      new_dialog_title: "Save current query as",
      remove_label: "Remove saved query",
      remove_label_with_name: 'Remove query "%{name}"',
      remove_dialog_title: "Remove saved query?",
      remove_message:
        "Are you sure you want to remove that item from your list of saved queries?",
      help: "Filter the list and save this query for later",
    },
    configurable: {
      customize: "Customize",
      configureMode: "Configure this page",
      inspector: {
        title: "Inspector",
        content: "Hover the application UI elements to configure them",
        reset: "Reset Settings",
        hideAll: "Hide All",
        showAll: "Show All",
      },
      Datagrid: {
        title: "Datagrid",
        unlabeled: "Unlabeled column #%{column}",
      },
      SimpleForm: {
        title: "Form",
        unlabeled: "Unlabeled input #%{input}",
      },
      SimpleList: {
        title: "List",
        primaryText: "Primary text",
        secondaryText: "Secondary text",
        tertiaryText: "Tertiary text",
      },
    },
  },
};

const spanishMessages: TranslationMessages = {
  ra: {
    action: {
      add_filter: "Añadir filtro",
      add: "Añadir",
      back: "Volver",
      bulk_actions:
        "1 ítem seleccionado |||| %{smart_count} ítems seleccionados",
      cancel: "Cancelar",
      clear_array_input: "Limpiar la lista",
      clear_input_value: "Limpiar valor",
      clone: "Clonar",
      confirm: "Confirmar",
      create: "Crear",
      create_item: "Crear %{item}",
      delete: "Eliminar",
      edit: "Editar",
      export: "Exportar",
      list: "Lista",
      refresh: "Actualizar",
      remove_filter: "Eliminar este filtro",
      remove_all_filters: "Eliminar todos los filtros",
      remove: "Eliminar",
      save: "Guardar",
      search: "Buscar",
      select_all: "Seleccionar todo",
      select_row: "Seleccionar esta fila",
      show: "Mostrar",
      sort: "Ordenar",
      undo: "Deshacer",
      unselect: "Deseleccionar",
      expand: "Expandir",
      close: "Cerrar",
      open_menu: "Abrir menú",
      close_menu: "Cerrar menú",
      update: "Actualizar",
      move_up: "Mover arriba",
      move_down: "Mover abajo",
      open: "Abrir",
      toggle_theme: "Cambiar tema",
      select_columns: "Columnas",
      update_application: "Recargar aplicación",
    },
    boolean: {
      true: "Sí",
      false: "No",
      null: " ",
    },
    page: {
      create: "Crear %{name}",
      dashboard: "Tablero",
      edit: "Editar %{name} %{recordRepresentation}",
      error: "Algo salió mal",
      list: "%{name}",
      loading: "Cargando",
      not_found: "No encontrado",
      show: "Mostrar %{name} %{recordRepresentation}",
      empty: "No hay %{name} todavía.",
      invite: "¿Quieres añadir uno?",
    },
    input: {
      file: {
        upload_several:
          "Arrastra algunos archivos para subir, o haz clic para seleccionar uno.",
        upload_single:
          "Arrastra un archivo para subir, o haz clic para seleccionarlo.",
      },
      image: {
        upload_several:
          "Arrastra algunas imágenes para subir, o haz clic para seleccionar una.",
        upload_single:
          "Arrastra una imagen para subir, o haz clic para seleccionarla.",
      },
      references: {
        all_missing: "No se pueden encontrar datos de referencias.",
        many_missing:
          "Al menos una de las referencias asociadas ya no parece estar disponible.",
        single_missing: "La referencia asociada ya no parece estar disponible.",
      },
      password: {
        toggle_visible: "Ocultar contraseña",
        toggle_hidden: "Mostrar contraseña",
      },
    },
    message: {
      about: "Acerca de",
      are_you_sure: "¿Estás seguro?",
      auth_error: "Ocurrió un error al validar el token de autenticación.",
      bulk_delete_content:
        "¿Estás seguro de que quieres eliminar este %{name}? |||| ¿Estás seguro de que quieres eliminar estos %{smart_count} ítems?",
      bulk_delete_title:
        "Eliminar %{name} |||| Eliminar %{smart_count} %{name}",
      bulk_update_content:
        "¿Estás seguro de que quieres actualizar este %{name}? |||| ¿Estás seguro de que quieres actualizar estos %{smart_count} ítems?",
      bulk_update_title:
        "Actualizar %{name} |||| Actualizar %{smart_count} %{name}",
      clear_array_input: "¿Estás seguro de que quieres limpiar toda la lista?",
      delete_content: "¿Estás seguro de que quieres eliminar este ítem?",
      delete_title: "Eliminar %{name} #%{id}",
      details: "Detalles",
      error:
        "Un error del cliente ocurrió y tu solicitud no pudo ser completada.",
      invalid_form:
        "El formulario no es válido. Por favor verifica los errores",
      loading: "La página está cargando, por favor espera un momento",
      no: "No",
      not_found:
        "O escribiste una URL incorrecta, o seguiste un enlace erróneo.",
      yes: "Sí",
      unsaved_changes:
        "Algunos de tus cambios no se guardaron. ¿Estás seguro de que quieres ignorarlos?",
    },
    navigation: {
      no_results: "No se encontraron resultados",
      no_more_results:
        "El número de página %{page} está fuera de los límites. Intenta con la página anterior.",
      page_out_of_boundaries: "Número de página %{page} fuera de los límites",
      page_out_from_end: "No se puede ir más allá de la última página",
      page_out_from_begin: "No se puede ir antes de la página 1",
      page_range_info: "%{offsetBegin}-%{offsetEnd} de %{total}",
      partial_page_range_info:
        "%{offsetBegin}-%{offsetEnd} de más de %{offsetEnd}",
      current_page: "Página %{page}",
      page: "Ir a la página %{page}",
      first: "Ir a la primera página",
      last: "Ir a la última página",
      next: "Ir a la siguiente página",
      previous: "Ir a la página anterior",
      page_rows_per_page: "Filas por página:",
      skip_nav: "Saltar al contenido",
    },
    sort: {
      sort_by: "Ordenar por %{field} %{order}",
      ASC: "ascendente",
      DESC: "descendente",
    },
    auth: {
      auth_check_error: "Por favor, inicia sesión para continuar",
      user_menu: "Perfil",
      username: "Nombre de usuario",
      password: "Contraseña",
      sign_in: "Iniciar sesión",
      sign_in_error: "La autenticación falló, por favor intenta nuevamente",
      logout: "Cerrar sesión",
    },
    notification: {
      updated:
        "Elemento actualizado |||| %{smart_count} elementos actualizados",
      created: "Elemento creado",
      deleted: "Elemento eliminado |||| %{smart_count} elementos eliminados",
      bad_item: "Elemento incorrecto",
      item_doesnt_exist: "El elemento no existe",
      http_error: "Error de comunicación con el servidor",
      data_provider_error:
        "Error del proveedor de datos. Revisa la consola para más detalles.",
      i18n_error:
        "No se pueden cargar las traducciones para el idioma especificado",
      canceled: "Acción cancelada",
      logged_out: "Tu sesión ha terminado, por favor reconéctate.",
      not_authorized: "No estás autorizado para acceder a este recurso.",
      application_update_available: "Una nueva versión está disponible.",
    },
    validation: {
      required: "Requerido",
      minLength: "Debe tener al menos %{min} caracteres",
      maxLength: "Debe tener %{max} caracteres o menos",
      minValue: "Debe ser al menos %{min}",
      maxValue: "Debe ser %{max} o menos",
      number: "Debe ser un número",
      email: "Debe ser un correo electrónico válido",
      oneOf: "Debe ser uno de: %{options}",
      regex: "Debe coincidir con un formato específico (regexp): %{pattern}",
      unique: "Debe ser único",
    },
    saved_queries: {
      label: "Consultas guardadas",
      query_name: "Nombre de la consulta",
      new_label: "Guardar consulta actual...",
      new_dialog_title: "Guardar consulta actual como",
      remove_label: "Eliminar consulta guardada",
      remove_label_with_name: 'Eliminar consulta "%{name}"',
      remove_dialog_title: "¿Eliminar consulta guardada?",
      remove_message:
        "¿Estás seguro de que quieres eliminar ese ítem de tu lista de consultas guardadas?",
      help: "Filtra la lista y guarda esta consulta para más tarde",
    },
    configurable: {
      customize: "Personalizar",
      configureMode: "Configurar esta página",
      inspector: {
        title: "Inspector",
        content:
          "Pasa el cursor sobre los elementos de la interfaz de la aplicación para configurarlos",
        reset: "Restablecer configuración",
        hideAll: "Ocultar todo",
        showAll: "Mostrar todo",
      },
      Datagrid: {
        title: "Cuadrícula de datos",
        unlabeled: "Columna sin etiqueta #%{column}",
      },
      SimpleForm: {
        title: "Formulario",
        unlabeled: "Entrada sin etiqueta #%{input}",
      },
      SimpleList: {
        title: "Lista",
        primaryText: "Texto principal",
        secondaryText: "Texto secundario",
        tertiaryText: "Texto terciario",
      },
    },
  },
};

let messages = englishMessages;
let locale = "en";

const i18nProvider = {
  translate: (key: string) => {
    const translation = lodashGet(messages, key);
    if (!translation) {
      console.warn(`Translation not found for key: ${key}`);
      return key;
    }
    return typeof translation === "string" ? translation : "";
  },
  changeLocale: (newLocale: string) => {
    messages = newLocale === "es" ? spanishMessages : englishMessages;
    locale = newLocale;
    return Promise.resolve();
  },
  getLocale: () => locale,
};

export default i18nProvider;
