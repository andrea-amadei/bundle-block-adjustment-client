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

export function CameraSettingsTable() {
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
    <table>
      <thead>
        <td>xi0</td>
        <td>eta0</td>
        <td>c</td>
        <td>k1</td>
        <td>k2</td>
        <td>k3</td>
        <td>p1</td>
        <td>p2</td>
        <td>a1</td>
        <td>a2</td>
      </thead>
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
    </table>
  );
}
