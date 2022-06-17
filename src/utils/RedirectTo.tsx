import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect } from "react";

export const RedirectTo: React.FC<{ path: string }> = ({ path }) => {
  const navigate = useNavigate();

  useEffect(
    () => navigate(path),
    [path, navigate]
  );

  return (
    <></>
  );

};