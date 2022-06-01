import { useSelector } from 'react-redux';
import { selectAllGroundControlPoints } from '../../../../core/model/slices/groundControlPointsSlice';

export function GCPImageTable() {
  const gcpList = useSelector(selectAllGroundControlPoints);

  return (
    <table>
      <thead>
        <td>id_gcp</td>
        <td>id_img</td>
        <td>x</td>
        <td>y</td>
        <td>source</td>
      </thead>
      {gcpList.map((gcp) =>
        gcp.linkedPoints.map((lp) => (
          <tr>
            <td>{gcp.pointId}</td>
            <td>{lp.imageId}</td>
            <td>{lp.x}</td>
            <td>{lp.y}</td>
            <td>{lp.source.toUpperCase()}</td>
          </tr>
        ))
      )}
    </table>
  );
}
