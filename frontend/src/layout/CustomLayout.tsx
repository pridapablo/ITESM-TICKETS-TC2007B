import { Layout, LayoutProps } from "react-admin";
import { TopBar } from "./TopBar";
export const CustomLayout = (props: LayoutProps) => (
  <Layout {...props} appBar={TopBar} />
);
