import { useSelector } from 'react-redux';
import { selectAllPoints } from '../../../../core/model/slices/resultSlice';

export function PointCloudTable() {
  const pointList = useSelector(selectAllPoints);

  return (
    <>
      <div className="buttons-row">
        <button onClick={() => console.log('Click!')}>Import from CSV</button>
        <button onClick={() => window.electron.exportPointCloudTable(pointList)}>Export to CSV</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>id_point</th>
            <th>x</th>
            <th>y</th>
            <th>z</th>
          </tr>
        </thead>
        <tbody>
          {pointList.map((p) => (
            <tr key={p.pointId}>
              <td>{p.pointId}</td>
              <td>{p.x}</td>
              <td>{p.y}</td>
              <td>{p.z}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
