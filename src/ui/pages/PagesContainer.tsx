import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { PageMenu } from "../components/PageMenu";
import { useEffect } from "react";

export function PagesContainer(props) {
  const location = useLocation();

  useEffect(
    () => console.log("PATH", location.pathname),
    [location.pathname]
  );
  return(
    <div className="pages-container">
      <PageMenu />
      <Outlet />
    </div>

  );
}