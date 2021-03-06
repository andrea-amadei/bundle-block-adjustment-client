import { useSelector } from 'react-redux';
import { PointInspector } from './PointInspector';
import { store } from '../../../../core/model/store';
import { selectImagesMap } from '../../../../core/model/slices/imageListSlice';
import {
  selectGroundControlPointById,
  selectGroundControlPointsOnImageById,
  setXByPointId,
  setYByPointId,
  setZByPointId,
  setLinkedPointX,
  setLinkedPointY,
  selectLinkedImagesListForGroundControlPoint, editPoint, GroundControlPoint
} from "../../../../core/model/slices/groundControlPointsSlice";
import { InputField } from '../../common/InputField';
import { useSearchParams } from 'react-router-dom';

export function PointInspectorGCP() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPointId = parseInt(searchParams.get('pointId') as string);
  const selectedImageId = parseInt(searchParams.get('imgId') as string);

  const point = useSelector(selectGroundControlPointById(selectedPointId));
  const pointOnImage = useSelector(
    selectGroundControlPointsOnImageById(selectedPointId, selectedImageId)
  );
  const linkedImages = useSelector(selectLinkedImagesListForGroundControlPoint(selectedPointId));
  const images = useSelector(selectImagesMap);

  if(point === undefined || pointOnImage === undefined)
    return (<></>);

  return (
    <PointInspector
      point={point}
      pointId={selectedPointId}
      imgId={selectedImageId}
      pointType="GCP"
      pointX={pointOnImage.x}
      setPointX={(x) => store.dispatch(setLinkedPointX(selectedPointId, selectedImageId, Math.round(parseFloat(x))))}
      pointY={pointOnImage.y}
      setPointY={(y) => store.dispatch(setLinkedPointY(selectedPointId, selectedImageId, Math.round(parseFloat(y))))}
      linkedImg={linkedImages.map((lp) => ({
        id: lp.imageId,
        name: images[lp.imageId].name,
        url: images[lp.imageId].path,
      }))}
      editPoint={editedPoint => store.dispatch(editPoint(editedPoint as GroundControlPoint))}
      additionalGlobalFields={
        <>
          <div className="point-position">
            <InputField
              type="number"
              label="X"
              value={point.x}
              setValue={(x) =>
                store.dispatch(setXByPointId(selectedPointId, parseFloat(x)))
              }
            />
            <InputField
              type="number"
              label="Y"
              value={point.y}
              setValue={(y) =>
                store.dispatch(setYByPointId(selectedPointId, parseFloat(y)))
              }
            />
            <InputField
              type="number"
              label="Z"
              value={point.z}
              setValue={(z) =>
                store.dispatch(setZByPointId(selectedPointId, parseFloat(z)))
              }
            />
          </div>
        </>
      }
    />
  );
}
