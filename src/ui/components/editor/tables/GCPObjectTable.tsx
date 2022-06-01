import { useSelector } from 'react-redux';
import { selectAllGroundControlPoints } from '../../../../core/model/slices/groundControlPointsSlice';

export function GCPObjectTable() {
  const gcpList = useSelector(selectAllGroundControlPoints);

  return (
    <table>
      <thead>
        <td>id_gcp</td>
        <td>x</td>
        <td>y</td>
        <td>z</td>
      </thead>
      {gcpList.map((gcp) => (
        <tr>
          <td>{gcp.pointId}</td>
          <td>{gcp.x}</td>
          <td>{gcp.y}</td>
          <td>{gcp.z}</td>
        </tr>
      ))}
    </table>
  );
}
