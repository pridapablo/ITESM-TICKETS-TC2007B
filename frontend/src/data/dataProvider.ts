import jsonServerProvider from "ra-data-json-server";
import { GetListParams } from "react-admin";

const originalDataProvider = jsonServerProvider(
  import.meta.env.VITE_JSON_SERVER_URL
);

const customDataProvider = {
  ...originalDataProvider,  // Extiende el data provider original para mantener las otras funciones

  // Modifica solo la función getList
  getList: async (resource: string, params: GetListParams) => {
    if (params.filter && params.filter.showDeleted) {
      // Si el filtro "showDeleted" está presente, modifica params para agregar tu filtro personalizado
      params.filter = { ...params.filter, filter: true };
    }

    // Llama al getList original con los params modificados
    return originalDataProvider.getList(resource, params);
  },

  update: async (resource: string, params: any) => {
    const response = await originalDataProvider.update(resource, params); // Puedes llamar al update original si lo necesitas
    if (response.data._id && !response.data.id) {
      response.data.id = response.data._id;
      delete response.data._id;
    }
    console.log(response);
    return { data: response.data };
  },
  delete: async (resource: string, params: any) => {
    const userID = localStorage.getItem('userID');

    const url = `${import.meta.env.VITE_JSON_SERVER_URL}/${resource}/${params.id}`;

    const options = {
      method: 'DELETE',
      body: JSON.stringify({ userID: userID }),  // Enviar userID en el cuerpo de la solicitud DELETE
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const responseData = await response.json();

    if (responseData._id && !responseData.id) {
      responseData.id = responseData._id;
      delete responseData._id;
    }

    return { data: responseData };
  },
  deleteMany: async (resource: string, params: any) => {
    const userID = localStorage.getItem('userID');

    const results = await Promise.all(params.ids.map(async (id: string) => {
      const url = `${import.meta.env.VITE_JSON_SERVER_URL}/${resource}/${id}`;

      const options = {
        method: 'DELETE',
        body: JSON.stringify({ userID: userID }),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return await response.json();
    }));

    return { data: results.map(r => r.id) };
  },
};

export const dataProvider = customDataProvider;
