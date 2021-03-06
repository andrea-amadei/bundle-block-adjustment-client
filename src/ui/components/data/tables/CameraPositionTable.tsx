import { useSelector } from 'react-redux';
import { selectAllCamerasList } from "../../../../core/model/slices/resultSlice";
import { importAndAddToStoreCameraPositionTable } from "../../../../main/ImportExportFromRenderer";

export function CameraPositionTable(props: { showImportButton: boolean }) {
  const { showImportButton } = props;

  const cameraList = useSelector(selectAllCamerasList);

  return (
    <>
      <div className="buttons-row">
        {showImportButton ? (
          <button onClick={() => importAndAddToStoreCameraPositionTable(true, true)}>Import from CSV</button>
        ) : (
          <></>
        )}
        <button onClick={() => window.electron.exportCameraPositionTable(cameraList, true)}>Export to CSV</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>id_img</th>
            <th>xc</th>
            <th>yc</th>
            <th>zc</th>
            <th>omega</th>
            <th>phi</th>
            <th>kappa</th>
          </tr>
        </thead>
        <tbody>
          {cameraList.map((c) => (
            <tr key={c.imageId}>
              <td>{c.imageId}</td>
              <td>{c.xc}</td>
              <td>{c.yc}</td>
              <td>{c.zc}</td>
              <td>{c.omega}</td>
              <td>{c.phi}</td>
              <td>{c.kappa}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
