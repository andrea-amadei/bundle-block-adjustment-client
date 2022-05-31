import { useSelector } from 'react-redux';
import { PointInspector } from './PointInspector';
import {
  selectTiePointById,
  selectTiePointOnImageById,
  setLinkedPointX,
  setLinkedPointY,
} from '../../core/model/slices/tiePointsSlice';
import { store } from '../../core/model/store';
import { selectImagesMap } from '../../core/model/slices/imageListSlice';
import useGetUrlParams from '../../utils/useGetUrlParams';

export function PointInspectorTP() {
  const { imgId: imgIdStr, pointId: pointIdStr } = useGetUrlParams();
  const imgId = imgIdStr ? parseInt(imgIdStr) : undefined;
  const pointId = pointIdStr ? parseInt(pointIdStr) : undefined;
  const point = useSelector(selectTiePointById(pointId));
  const pointOnImage = useSelector(selectTiePointOnImageById(pointId, imgId));
  const images = useSelector(selectImagesMap);

  return (
    <PointInspector
      pointId={pointId || -1}
      imgId={imgId || -1}
      pointType="TP"
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
    />
  );
}
