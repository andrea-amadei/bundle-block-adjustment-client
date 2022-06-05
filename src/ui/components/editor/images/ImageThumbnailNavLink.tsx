import './ImageThumbnailNavLink.scss';
import { useSearchParams } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectTiePointsOnImage } from '../../../../core/model/slices/tiePointsSlice';
import { selectGroundControlPointsOnImage } from '../../../../core/model/slices/groundControlPointsSlice';

interface PropsType {
  title?: string | null;
  imgSrc: string;
  imgId: number;
}

export const ImageThumbnailNavLink: React.FC<PropsType> = (props) => {
  const { title, imgSrc, imgId } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPointId = parseInt(searchParams.get('pointId') as string);
  const selectedPointType = searchParams.get('pointType');

  const tpOnImage = useSelector(selectTiePointsOnImage(imgId));
  const gcpOnImage = useSelector(selectGroundControlPointsOnImage(imgId));

  return (
    <div
      key={imgId}
      className="img-thumbnail"
      onClick={() => {
        searchParams.set('imgId', String(imgId));

        if (selectedPointId !== null)
          if (
            (selectedPointType === 'TP' &&
              !tpOnImage.some((tp) => tp.pointId === selectedPointId)) ||
            (selectedPointType === 'GCP' &&
              !gcpOnImage.some((gcp) => gcp.pointId === selectedPointId))
          ) {
            searchParams.delete('pointId');
            searchParams.delete('pointType');
          }

        setSearchParams(searchParams);
      }}
    >
      {title && <div className="img-title">{title}</div>}
      <img src={imgSrc} alt={imgSrc} />
    </div>
  );
};

ImageThumbnailNavLink.defaultProps = {
  title: null,
};
