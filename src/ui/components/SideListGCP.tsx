import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SideList } from './SideList';
import { selectGroundControlPointsOnImageBySourceType } from "../../core/model/slices/groundControlPointsSlice";

export function SideListGCP() {
  const { selectedImageId } = useParams();
  let imgId: undefined | number;
  if (selectedImageId != null) imgId = parseInt(selectedImageId);
  const gcpListBySource = {
    manual: useSelector(
      selectGroundControlPointsOnImageBySourceType(imgId, 'MANUAL')
    ),
    imported: useSelector(
      selectGroundControlPointsOnImageBySourceType(imgId, 'IMPORTED')
    )
  };
  return <SideList pointType="GCP" points={gcpListBySource} />;
}
