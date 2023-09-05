import { useNotify, useRedirect, useRefresh } from "react-admin";

export const useSuccessHandler = (message: string, route: string) => {
  const notify = useNotify();
  const redirect = useRedirect();
  const refresh = useRefresh();

  return () => {
    notify(message);
    redirect(route);
    refresh();
  };
};
