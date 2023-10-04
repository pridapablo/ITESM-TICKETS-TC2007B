import jsonServerProvider from "ra-data-json-server";
// import { fetchUtils } from 'react-admin';

// interface FetchOptions {
//   // eslint-disable-next-line no-undef
//   headers?: HeadersInit;
// }

// const fetchJsonUtil = (url: string, options: FetchOptions = {}) => {
//   options.headers = {
//     ...options.headers,
//     "Authentication": localStorage.getItem("auth") || "",
//   };
//   return fetchUtils.fetchJson(url, options);
// };
import { GetListParams } from "react-admin";

const originalDataProvider = jsonServerProvider(
  import.meta.env.VITE_JSON_SERVER_URL,
  // fetchJsonUtil
);

const customDataProvider = {
  ...originalDataProvider,  

  getList: async (resource: string, params: GetListParams) => {
    if (params.filter && params.filter.showDeleted) {
      params.filter = { ...params.filter, filter: true }; // add filter=true to the params when showDeleted is true
    }

    return originalDataProvider.getList(resource, params); // call the original getList method with correct params
  },

  delete: async (resource: string, params: any) => { // TODO: this can be done at provider level instead of crud level
    const userID = localStorage.getItem('userID');

    const url = `${import.meta.env.VITE_JSON_SERVER_URL}/${resource}/${params.id}`;

    const options = {
      method: 'DELETE',
      body: JSON.stringify({ userID: userID }), // Add userID to the body of the request
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

  deleteMany: async (resource: string, params: any) => { // TODO: this can be done at provider level instead of crud level
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
