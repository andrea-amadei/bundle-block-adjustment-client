import { useSelector } from 'react-redux';
import { selectAllCameras } from '../../../../core/model/slices/resultSlice';

export function CameraPositionTable(props: { showImportButton: boolean }) {
  const { showImportButton } = props;

  const cameraList = useSelector(selectAllCameras);

  return (
    <>
      <div className="buttons-row">
        {showImportButton ? (
          <button onClick={() => window.electron.importCameraPositionTable(true)}>Import from CSV</button>
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
