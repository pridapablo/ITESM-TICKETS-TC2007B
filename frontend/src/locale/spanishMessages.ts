import { TranslationMessages } from "react-admin";

export const es: TranslationMessages = {
  resources: {
    posts: 'Publicaciones',
    users: 'Usuarios',
    albums: 'Álbumes',
    tickets: 'Tickets',
  },
  login: {
    username: 'Nombre de usuario',
    password: 'Contraseña',
    loginButton: 'Iniciar sesión',
    loginError: 'Error durante el proceso de inicio de sesión',
  },
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
