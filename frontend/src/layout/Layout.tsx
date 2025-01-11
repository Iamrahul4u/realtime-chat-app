import { Outlet } from "react-router";
import Navbar from "../components/shared/Navbar.tsx";

export const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
