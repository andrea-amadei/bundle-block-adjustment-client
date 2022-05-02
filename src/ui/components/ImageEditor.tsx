import "./ImageEditor.scss"

import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectImageById } from "../../core/model/slices/imageListSlice";
import { selectAllTiePoints } from "../../core/model/slices/tiePointsSlice";
import { selectAllGroundControlPoints } from "../../core/model/slices/groundControlPointsSlice";
import { useEffect } from "react";

export function ImageEditor(props) {
  const {selectedImageId, selectedPointType, selectedPointId} = useParams();

  if(!selectedImageId)
    throw new Error("No image selected!");

  const selectedImage = useSelector(selectImageById(selectedImageId));
  const tpList = useSelector(selectAllTiePoints);
  const gcpList = useSelector(selectAllGroundControlPoints);

  useEffect(
    () => console.log(selectedImageId, selectedImage),
    [selectedImage, selectedImageId]
  );

  if(selectedImage)
    return (
      <div className="editor-img-container">
        <div className="img-title">
          { `[${selectedImage.id}] ${selectedImage.name}` }
        </div>
        <img className="editor-img" src={selectedImage.path} alt={selectedImage.path}/>
      </div>
    );
  else
    return (
      <div>Loading...</div>
    );

}