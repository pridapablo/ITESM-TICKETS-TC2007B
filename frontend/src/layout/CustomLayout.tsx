import { Layout, LayoutProps } from "react-admin";
import { TopBar } from "./TopBar";

export const CustomLayout = (props: LayoutProps) => {
  return (
    <Layout {...props} appBar={TopBar} style={{ paddingTop: '36px' }} />
  );
};
