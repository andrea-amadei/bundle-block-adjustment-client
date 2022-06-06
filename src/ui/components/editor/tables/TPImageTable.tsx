import { useSelector } from 'react-redux';
import { selectAllTiePoints } from '../../../../core/model/slices/tiePointsSlice';

export function TPImageTable() {
  const tpList = useSelector(selectAllTiePoints);

  function exportToCSV() {
    const data = tpList.flatMap((tp) =>
      tp.linkedPoints.map((lp) => [
        lp.pointId,
        lp.imageId,
        lp.x,
        lp.y,
        lp.source,
      ])
    );

    window.electron
      .convertDataToCSV(data)
      .then((result: string) => console.log(result))
      .catch((error: Error) => console.log(error));
  }

  return (
    <>
      <div className="buttons-row">
        <button onClick={() => console.log('Click!')}>Import from CSV</button>
        <button onClick={() => exportToCSV()}>Export to CSV</button>
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
            tp.linkedPoints.map((lp) => (
              <tr key={`${lp.pointId},${lp.imageId}`}>
                <td>{tp.pointId}</td>
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
