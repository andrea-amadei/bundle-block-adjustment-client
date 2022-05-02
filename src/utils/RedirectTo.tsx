import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect } from "react";

export const RedirectTo: React.FC<{ addToPath: string }> = ({ addToPath }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(
    () => navigate(location.pathname + (addToPath.charAt(0) === "/" ? "" : "/") + addToPath),
    [addToPath, location.pathname, navigate]
  );

  return (
    <></>
  );

};