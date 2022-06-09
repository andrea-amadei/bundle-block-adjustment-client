import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  addNewPointWithLinkedImage,
  selectTiePointsOnImageBySourceType
} from "../../../../core/model/slices/tiePointsSlice";
import { SideList } from './SideList';
import { store } from "../../../../core/model/store";

export function SideListTP() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedImageId = parseInt(searchParams.get('imgId') as string);

  let imgId: undefined | number;
  if (selectedImageId != null) imgId = parseInt(selectedImageId);
  const tpListBySource = {
    manual: useSelector(
      selectTiePointsOnImageBySourceType(imgId, 'MANUAL')
    ),
    imported: useSelector(
      selectTiePointsOnImageBySourceType(imgId, 'IMPORTED')
    ),
    auto: useSelector(
      selectTiePointsOnImageBySourceType(imgId, 'AUTO')
    ),
  };
  return <SideList pointType="TP" points={tpListBySource} addPoint={() => store.dispatch(addNewPointWithLinkedImage(selectedImageId))}/>;
}
