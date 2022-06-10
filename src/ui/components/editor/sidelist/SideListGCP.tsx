import { useParams, useSearchParams } from 'react-router-dom';import { useSelector } from 'react-redux';import { SideList } from './SideList';import {  addNewDefaultPointWithLinkedImage, removeLinkedPointByPointId, removePointByPointId, selectGroundControlPointList,  selectGroundControlPointsOnImageBySourceType} from "../../../../core/model/slices/groundControlPointsSlice";import { store } from "../../../../core/model/store";export function SideListGCP() {  const [searchParams, setSearchParams] = useSearchParams();  const selectedImageId = parseInt(searchParams.get('imgId') as string);  const gcpList = useSelector(selectGroundControlPointList);  let imgId: undefined | number;  if (selectedImageId != null) imgId = parseInt(selectedImageId);  const gcpListBySource = {    manual: useSelector(      selectGroundControlPointsOnImageBySourceType(imgId, 'MANUAL')    ),    imported: useSelector(      selectGroundControlPointsOnImageBySourceType(imgId, 'IMPORTED')    ),  };  function deselectPoint() {    searchParams.delete('pointId');    searchParams.delete('pointType');    setSearchParams(searchParams);  }  return <SideList    pointType="GCP"    points={gcpListBySource}    addPoint={() => {      const newPointId = gcpList.map(gcp => gcp.pointId).sort( (a,b) => b - a)[0] + 1;      store.dispatch(addNewDefaultPointWithLinkedImage(selectedImageId));      searchParams.set('pointId', newPointId.toString());      searchParams.set('pointType', 'GCP');      setSearchParams(searchParams);    }}    unlinkPoint={(pointId, imageId) => {      if(parseInt(searchParams.get('pointId') as string) === pointId && searchParams.get('pointType') === 'GCP')        deselectPoint();      store.dispatch(removeLinkedPointByPointId(pointId, imageId));    }}    deletePoint={(pointId) => {      if(parseInt(searchParams.get('pointId') as string) === pointId && searchParams.get('pointType') === 'GCP')        deselectPoint();      store.dispatch(removePointByPointId(pointId));    }}  />;}