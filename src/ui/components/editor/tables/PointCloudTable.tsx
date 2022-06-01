import { useSelector } from 'react-redux';
import { selectAllPoints } from '../../../../core/model/slices/resultSlice';

export function PointCloudTable() {
  const pointList = useSelector(selectAllPoints);

  return (
    <table>
      <thead>
        <td>id_point</td>
        <td>x</td>
        <td>y</td>
        <td>z</td>
      </thead>
      {pointList.map((p) => (
        <tr>
          <td>{p.pointId}</td>
          <td>{p.x}</td>
          <td>{p.y}</td>
          <td>{p.z}</td>
        </tr>
      ))}
    </table>
  );
}
