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
} from '../../../../core/model/slices/groundControlPointsSlice';
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
  const images = useSelector(selectImagesMap);

  return (
    <PointInspector
      pointId={selectedPointId}
      imgId={selectedImageId}
      pointType="GCP"
      pointX={pointOnImage.x}
      setPointX={(x) => store.dispatch(setLinkedPointX(selectedPointId, selectedImageId, parseInt(x)))}
      pointY={pointOnImage.y}
      setPointY={(y) => store.dispatch(setLinkedPointY(selectedPointId, selectedImageId, parseInt(y)))}
      linkedImg={point.linkedPoints.map((lp) => ({
        id: lp.imageId,
        name: images[lp.imageId].name,
        url: images[lp.imageId].path,
      }))}
      additionalGlobalFields={
        <>
          <div className="point-position">
            <InputField
              type="number"
              label="X"
              value={point.x}
              setValue={(x) =>
                store.dispatch(setXByPointId(selectedPointId, parseInt(x)))
              }
            />
            <InputField
              type="number"
              label="Y"
              value={point.y}
              setValue={(y) =>
                store.dispatch(setYByPointId(selectedPointId, parseInt(y)))
              }
            />
            <InputField
              type="number"
              label="Z"
              value={point.z}
              setValue={(z) =>
                store.dispatch(setZByPointId(selectedPointId, parseInt(z)))
              }
            />
          </div>
        </>
      }
    />
  );
}
