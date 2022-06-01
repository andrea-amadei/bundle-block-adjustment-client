import { useSelector } from 'react-redux';
import { selectAllCameras } from '../../../../core/model/slices/resultSlice';

export function CameraPositionTable() {
  const cameraList = useSelector(selectAllCameras);

  return (
    <table>
      <thead>
        <td>id_img</td>
        <td>xc</td>
        <td>yc</td>
        <td>zc</td>
        <td>omega</td>
        <td>phi</td>
        <td>kappa</td>
      </thead>
      {cameraList.map((c) => (
        <tr>
          <td>{c.imageId}</td>
          <td>{c.xc}</td>
          <td>{c.yc}</td>
          <td>{c.zc}</td>
          <td>{c.omega}</td>
          <td>{c.phi}</td>
          <td>{c.kappa}</td>
        </tr>
      ))}
    </table>
  );
}
