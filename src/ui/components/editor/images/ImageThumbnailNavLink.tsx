import './ImageThumbnailNavLink.scss';
import { useSearchParams } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  removeAllLinkedPointsByImageId as removeAllLinkedPointsByImageIdTP,
  selectTiePointsOnImage,
} from '../../../../core/model/slices/tiePointsSlice';
import {
  removeAllLinkedPointsByImageId as removeAllLinkedPointsByImageIdGCP,
  selectGroundControlPointsOnImage
} from '../../../../core/model/slices/groundControlPointsSlice';
import { store } from '../../../../core/model/store';
import { removeImageById } from '../../../../core/model/slices/imageListSlice';

interface PropsType {
  title?: string | null;
  imgSrc: string;
  imgId: number;
}

export const ImageThumbnailNavLink: React.FC<PropsType> = (props) => {
  const { title, imgSrc, imgId } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPointId = parseInt(searchParams.get('pointId') as string, 10);
  const selectedPointType = searchParams.get('pointType');

  const tpOnImage = useSelector(selectTiePointsOnImage(imgId));
  const gcpOnImage = useSelector(selectGroundControlPointsOnImage(imgId));

  function onRemoveImg() {
    window.electron.removeFile(imgSrc);
    store.dispatch(removeImageById(imgId));
    store.dispatch(removeAllLinkedPointsByImageIdTP(imgId));
    store.dispatch(removeAllLinkedPointsByImageIdGCP(imgId));
  }

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
      <button className="img-remove" onClick={onRemoveImg}>
        <span className="material-symbols-outlined">
          close
        </span>
      </button>
      <img src={imgSrc} alt={imgSrc} />
      {title && <div className="img-title">{title}</div>}
    </div>
  );
};

ImageThumbnailNavLink.defaultProps = {
  title: null,
};
