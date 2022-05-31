import { useSelector } from 'react-redux';
import { PointInspector } from './PointInspector';
import {
  setLinkedPointX,
  setLinkedPointY,
} from '../../core/model/slices/tiePointsSlice';
import { store } from '../../core/model/store';
import { selectImagesMap } from '../../core/model/slices/imageListSlice';
import useGetUrlParams from '../../utils/useGetUrlParams';
import {
  selectGroundControlPointById,
  selectGroundControlPointsOnImageById, setXByPointId, setYByPointId, setZByPointId
} from "../../core/model/slices/groundControlPointsSlice";
import { InputField } from '../common/InputField';

export function PointInspectorGCP() {
  const { imgId: imgIdStr, pointId: pointIdStr } = useGetUrlParams();
  const imgId = imgIdStr ? parseInt(imgIdStr) : undefined;
  const pointId = pointIdStr ? parseInt(pointIdStr) : undefined;
  const point = useSelector(selectGroundControlPointById(pointId));
  const pointOnImage = useSelector(
    selectGroundControlPointsOnImageById(pointId, imgId)
  );
  const images = useSelector(selectImagesMap);

  return (
    <PointInspector
      pointId={pointId || -1}
      imgId={imgId || -1}
      pointType="GCP"
      pointX={pointOnImage.x}
      setPointX={(x) => store.dispatch(setLinkedPointX(pointId, imgId, x))}
      pointY={pointOnImage.y}
      setPointY={(y) => store.dispatch(setLinkedPointY(pointId, imgId, y))}
      linkedImg={point.linkedPoints.map((lp) => ({
        id: lp.imageId,
        name: images[lp.imageId].name,
        url: images[lp.imageId].path,
        linkPath: `/editor/${lp.imageId}/TP/${pointId}`,
      }))}
      additionalGlobalFields={
        <>
          <div className="point-position">
            <InputField
              type="number"
              label="X"
              value={point.x}
              setValue={(x) => store.dispatch(setXByPointId(pointId, x))}
            />
            <InputField
              type="number"
              label="Y"
              value={point.y}
              setValue={(y) => store.dispatch(setYByPointId(pointId, y))}
            />
            <InputField
              type="number"
              label="Z"
              value={point.z}
              setValue={(z) => store.dispatch(setZByPointId(pointId, z))}
            />
          </div>
        </>
      }
    />
  );
}
