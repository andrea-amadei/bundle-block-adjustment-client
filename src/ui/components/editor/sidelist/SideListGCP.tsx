import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SideList } from './SideList';
import {
  addNewPointWithLinkedImage,
  selectGroundControlPointsOnImageBySourceType
} from "../../../../core/model/slices/groundControlPointsSlice";
import { store } from "../../../../core/model/store";

export function SideListGCP() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedImageId = parseInt(searchParams.get('imgId') as string);

  let imgId: undefined | number;
  if (selectedImageId != null) imgId = parseInt(selectedImageId);
  const gcpListBySource = {
    manual: useSelector(
      selectGroundControlPointsOnImageBySourceType(imgId, 'MANUAL')
    ),
    imported: useSelector(
      selectGroundControlPointsOnImageBySourceType(imgId, 'IMPORTED')
    ),
  };
  return <SideList pointType="GCP" points={gcpListBySource} addPoint={() => store.dispatch(addNewPointWithLinkedImage(selectedImageId))} />;
}
