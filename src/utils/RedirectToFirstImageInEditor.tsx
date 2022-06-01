import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAllImages } from '../core/model/slices/imageListSlice';
import { useEffect } from 'react';

export function RedirectToFirstImageInEditor() {
  const navigate = useNavigate();
  const imageList = useSelector(selectAllImages);

  useEffect(
    () => navigate(`/editor/?imgId=${imageList[0].id}&pointType=TP&currentType=TP`),
    [navigate, imageList]
  );

  return <></>;
}
