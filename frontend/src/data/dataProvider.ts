import jsonServerProvider from "ra-data-json-server";

const originalDataProvider = jsonServerProvider(
  import.meta.env.VITE_JSON_SERVER_URL
);

export const dataProvider = originalDataProvider;
