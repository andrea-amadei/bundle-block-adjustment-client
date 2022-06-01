import { useSelector } from 'react-redux';
import { selectAllTiePoints } from '../../../../core/model/slices/tiePointsSlice';

export function TPImageTable() {
  const tpList = useSelector(selectAllTiePoints);

  return (
    <table>
      <thead>
        <td>id_tie</td>
        <td>id_img</td>
        <td>x</td>
        <td>y</td>
        <td>source</td>
      </thead>
      {tpList.map((tp) =>
        tp.linkedPoints.map((lp) => (
          <tr>
            <td>{tp.pointId}</td>
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
