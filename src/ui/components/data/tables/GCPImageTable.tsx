import { useSelector } from 'react-redux';
import { selectGroundControlPointList } from '../../../../core/model/slices/groundControlPointsSlice';

export function GCPImageTable() {
  const gcpList = useSelector(selectGroundControlPointList);

  return (
    <>
      <div className="buttons-row">
        <button onClick={() => console.log('Click!')}>Import from CSV</button>
        <button onClick={() => window.electron.exportGCPImageTable(gcpList)}>Export to CSV</button>
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
            gcp.linkedImages.map((lp) => (
              <tr key={`${gcp.pointId},${lp.imageId}`}>
                <td>{gcp.pointId}</td>
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
