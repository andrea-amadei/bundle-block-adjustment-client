import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectTiePointsOnImageBySourceType } from '../../core/model/slices/tiePointsSlice';
import { SideList } from './SideList';

export function SideListTP() {
  const { selectedImageId } = useParams();
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
  return <SideList pointType="TP" points={tpListBySource} />;
}
