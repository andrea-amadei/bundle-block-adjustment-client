import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllImages } from "../core/model/slices/imageListSlice";
import { useEffect } from "react";

export function RedirectToFirstImageInEditor(props) {
  const navigate = useNavigate();
  const imageList = useSelector(selectAllImages);

  useEffect(
    () => navigate(`/editor/${imageList[0].id}`),
    [navigate, imageList]
  );

  return (
    <></>
  );

};