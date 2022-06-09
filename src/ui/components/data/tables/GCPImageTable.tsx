import { useSelector } from 'react-redux';
import { selectGroundControlPointList } from '../../../../core/model/slices/groundControlPointsSlice';

export function GCPImageTable() {
  const gcpList = useSelector(selectGroundControlPointList);

  return (
    <>
      <div className="buttons-row">
        <button onClick={() => console.log('Click!')}>Import from CSV</button>
        <button onClick={() => window.electron.exportGCPImageTable(gcpList, true)}>Export to CSV</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>id_gcp</th>
            <th>id_img</th>
            <th>x</th>
            <th>y</th>
            <th>source</th>
          </tr>
        </thead>
        <tbody>
          {gcpList.map((gcp) =>
            Object.entries(gcp.linkedImages).map(([, p]) => (
              <tr key={`${p.pointId},${p.imageId}`}>
                <td>{p.pointId}</td>
                <td>{p.imageId}</td>
                <td>{p.x}</td>
                <td>{p.y}</td>
                <td>{p.source.toUpperCase()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
