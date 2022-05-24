import { NavLink } from 'react-router-dom';
import React from 'react';
import './ImagePreview.scss';

interface PropType {
  imageId: number;
  imageName: string;
  imageUrl: string;
  linkPath: string;
}


const MAX_SHORT_NAME_LEN = 8;

export const ImagePreview: React.FC<PropType> = (
  {imageId, imageUrl, imageName, linkPath}
) => {

  let shortName = imageName;
  if(imageName.length > MAX_SHORT_NAME_LEN)
    shortName = `${imageName.slice(0, MAX_SHORT_NAME_LEN - 3)}...`;


  return (
    <NavLink className="image-preview-container" to={linkPath} end={false}>
      <img className="img-preview" src={imageUrl} alt={`Image ${imageName}`}/>
      <div className="text">{`[${imageId}] ${shortName}`}</div>
    </NavLink>
  );
}


