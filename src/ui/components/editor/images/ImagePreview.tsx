import { useSearchParams } from 'react-router-dom';
import React from 'react';
import './ImagePreview.scss';

interface PropType {
  imageId: number;
  imageName: string;
  imageUrl: string;
}

const MAX_SHORT_NAME_LEN = 8;

export const ImagePreview: React.FC<PropType> = ({
  imageId,
  imageUrl,
  imageName,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedImageId = parseInt(searchParams.get('imgId') as string);

  let shortName = imageName;
  if (imageName.length > MAX_SHORT_NAME_LEN)
    shortName = `${imageName.slice(0, MAX_SHORT_NAME_LEN - 3)}...`;

  return (
    <div
      className="image-preview-container"
      onClick={() => {
        searchParams.set('imgId', String(imageId));
        setSearchParams(searchParams);
      }}
    >
      <img className={`img-preview ${selectedImageId === imageId ? 'active': ''}`} src={imageUrl} alt={`Image ${imageName}`} />
      <div className="text">
        <span className="image-id">{imageId}</span>
        <span>{shortName}</span>
      </div>
    </div>
  );
};
