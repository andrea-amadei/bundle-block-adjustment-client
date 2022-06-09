import { useSelector } from 'react-redux';
import { selectAllGroundControlPoints } from '../../../../core/model/slices/groundControlPointsSlice';

export function GCPObjectTable() {
  const gcpList = useSelector(selectAllGroundControlPoints);

  return (
    <>
      <div className="buttons-row">
        <button onClick={() => console.log('Click!')}>Import from CSV</button>
        <button onClick={() => window.electron.exportGCPObjectTable(gcpList, true)}>Export to CSV</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>id_gcp</th>
            <th>x</th>
            <th>y</th>
            <th>z</th>
          </tr>
        </thead>
        <tbody>
          {gcpList.map((gcp) => (
            <tr key={gcp.pointId}>
              <td>{gcp.pointId}</td>
              <td>{gcp.x}</td>
              <td>{gcp.y}</td>
              <td>{gcp.z}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
