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
};

export const dataProvider = customDataProvider;
