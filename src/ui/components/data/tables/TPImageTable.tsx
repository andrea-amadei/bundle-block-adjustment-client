import { useSelector } from 'react-redux';
import { selectTiePointList } from '../../../../core/model/slices/tiePointsSlice';

export function TPImageTable() {
  const tpList = useSelector(selectTiePointList);

  return (
    <>
      <div className="buttons-row">
        <button onClick={() => console.log('Click!')}>Import from CSV</button>
        <button onClick={() => window.electron.exportTPImageTable(tpList, true)}>
          Export to CSV
        </button>
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
            Object.entries(tp.linkedImages).map(([, p]) => (
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