import { useSelector } from 'react-redux';
import { selectAllPoints } from '../../../../core/model/slices/resultSlice';
import { importAndAddToStorePointCloudTable } from "../../../../main/InportExportFromRenderer";

export function PointCloudTable(props: { showImportButton: boolean }) {
  const { showImportButton } = props;

  const pointList = useSelector(selectAllPoints);

  return (
    <>
      <div className="buttons-row">
        {showImportButton ? (
          <button onClick={() => importAndAddToStorePointCloudTable(true, true)}>Import from CSV</button>
        ) : (
          <></>
        )}
        <button onClick={() => window.electron.exportPointCloudTable(pointList, true)}>Export to CSV</button>
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
