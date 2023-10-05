import jsonServerProvider from "ra-data-json-server";
import { fetchUtils } from 'react-admin';
import { GetListParams } from "react-admin";

type HeadersInit = Headers | string[][] | Record<string, string>;

interface FetchOptions {
    headers?: HeadersInit;
    [key: string]: any;  // This allows other properties as well, aligning more closely with the `Options` type
}

const fetchJsonUtil = (url: string, options: FetchOptions = {}) => {
    let headers: Headers = new Headers();
    if (options.headers instanceof Headers) {
        headers = options.headers;
    } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([name, value]) => {
            headers.append(name, value);
        });
    } else if (options.headers) {
        Object.entries(options.headers).forEach(([name, value]) => {
            headers.append(name, value);
        });
    }

    headers.append("Authentication", localStorage.getItem("auth") || "");

    return fetchUtils.fetchJson(url, { ...options, headers });
};


const originalDataProvider = jsonServerProvider(
  import.meta.env.VITE_JSON_SERVER_URL,
  fetchJsonUtil
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
