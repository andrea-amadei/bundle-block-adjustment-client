import { useSelector } from 'react-redux';
import { selectAllTiePoints } from '../../../../core/model/slices/tiePointsSlice';

export function TPImageTable() {
  const tpList = useSelector(selectAllTiePoints);

  return (
    <>
      <div className="buttons-row">
        <button onClick={() => console.log('Click!')}>Import from CSV</button>
        <button onClick={() => console.log('Click!')}>Export to CSV</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>id_tie</th>
            <th>id_img</th>
            <th>x</th>
            <th>y</th>
            <th>source</th>
          </tr>
        </thead>
        <tbody>
          {tpList.map((tp) =>
            tp.linkedPoints.map((lp) => (
              <tr key={`${lp.pointId},${lp.imageId}`}>
                <td>{tp.pointId}</td>
                <td>{lp.imageId}</td>
                <td>{lp.x}</td>
                <td>{lp.y}</td>
                <td>{lp.source.toUpperCase()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
