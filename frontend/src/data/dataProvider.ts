import jsonServerProvider from "ra-data-json-server";
import { GetListParams } from 'react-admin';

const originalDataProvider = jsonServerProvider(
  import.meta.env.VITE_JSON_SERVER_URL
);

const customDataProvider = {
  ...originalDataProvider,
  getList: (resource: string, params: GetListParams) => {
    if (resource === 'tickets') {
      return Promise.resolve({
        data: [],
        total: 0
      });
    }
    return originalDataProvider.getList(resource, params);
  },
  // Puedes hacer lo mismo para otros métodos como getOne, getMany, etc. si es necesario
};

export const dataProvider = customDataProvider;
