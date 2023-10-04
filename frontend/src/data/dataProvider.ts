import jsonServerProvider from "ra-data-json-server";
import { fetchUtils } from 'react-admin';

interface FetchOptions {
  // eslint-disable-next-line no-undef
  headers?: HeadersInit;
}

const fetchJsonUtil = (url: string, options: FetchOptions = {}) => {
  options.headers = {
    ...options.headers,
    "Authentication": localStorage.getItem("auth") || "",
  };
  return fetchUtils.fetchJson(url, options);
};

const originalDataProvider = jsonServerProvider(
import.meta.env.VITE_JSON_SERVER_URL,
fetchJsonUtil
);

export const dataProvider = originalDataProvider;