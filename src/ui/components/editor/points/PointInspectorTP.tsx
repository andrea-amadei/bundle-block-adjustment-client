import { PointInspector } from './PointInspector';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  selectLinkedImagesListForTiePoint,
  editPoint,
  selectTiePointById,
  selectTiePointOnImageById,
  setLinkedPointX,
  setLinkedPointY, TiePoint
} from "../../../../core/model/slices/tiePointsSlice";
import { store } from '../../../../core/model/store';
import { selectImagesMap } from '../../../../core/model/slices/imageListSlice';

export function PointInspectorTP() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPointId = parseInt(searchParams.get('pointId') as string);
  const selectedImageId = parseInt(searchParams.get('imgId') as string);

  const point = useSelector(selectTiePointById(selectedPointId));
  const pointOnImage = useSelector(selectTiePointOnImageById(selectedPointId, selectedImageId));
  const linkedImages = useSelector(selectLinkedImagesListForTiePoint(selectedPointId));
  const allImages = useSelector(selectImagesMap);

  if(point === undefined || pointOnImage === undefined)
    return (<></>);

  return (
    <PointInspector
      point={point}
      pointId={selectedPointId}
      imgId={selectedImageId}
      pointType="TP"
      pointX={pointOnImage.x}
      setPointX={(x) => store.dispatch(setLinkedPointX(selectedPointId, selectedImageId, parseInt(x)))}
      pointY={pointOnImage.y}
      setPointY={(y) => store.dispatch(setLinkedPointY(selectedPointId, selectedImageId, parseInt(y)))}
      editPoint={editedPoint => store.dispatch(editPoint(editedPoint as TiePoint))}
      linkedImg={linkedImages.map((lp) => ({
        id: lp.imageId,
        name: allImages[lp.imageId].name,
        url: allImages[lp.imageId].path,
      }))}
    />
  );
}