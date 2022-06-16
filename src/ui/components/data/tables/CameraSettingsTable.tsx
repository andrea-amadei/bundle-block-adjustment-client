import { importAndAddToStoreCameraSettingsTable } from 'main/ImportExportFromRenderer';
import { useSelector } from 'react-redux';
import {
  selectA1,
  selectA2,
  selectC,
  selectEta0,
  selectK1,
  selectK2,
  selectK3,
  selectP1,
  selectP2,
  selectXi0,
} from '../../../../core/model/slices/cameraSlice';

export function CameraSettingsTable(props: { showImportButton: boolean }) {
  const { showImportButton } = props;

  const xi0 = useSelector(selectXi0);
  const eta0 = useSelector(selectEta0);
  const c = useSelector(selectC);
  const k1 = useSelector(selectK1);
  const k2 = useSelector(selectK2);
  const k3 = useSelector(selectK3);
  const p1 = useSelector(selectP1);
  const p2 = useSelector(selectP2);
  const a1 = useSelector(selectA1);
  const a2 = useSelector(selectA2);

  return (
    <>
      <div className="buttons-row">
        {showImportButton ? (
          <button onClick={() => importAndAddToStoreCameraSettingsTable(true, true)}>Import from CSV</button>
        ) : (
          <></>
        )}
        <button onClick={() => window.electron.exportCameraSettingsTable({ xi0, eta0, c, k1, k2, k3, p1, p2, a1, a2 }, true)}>Export to CSV</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>xi0</th>
            <th>eta0</th>
            <th>c</th>
            <th>k1</th>
            <th>k2</th>
            <th>k3</th>
            <th>p1</th>
            <th>p2</th>
            <th>a1</th>
            <th>a2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{xi0}</td>
            <td>{eta0}</td>
            <td>{c}</td>
            <td>{k1}</td>
            <td>{k2}</td>
            <td>{k3}</td>
            <td>{p1}</td>
            <td>{p2}</td>
            <td>{a1}</td>
            <td>{a2}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
