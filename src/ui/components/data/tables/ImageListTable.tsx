import { useSelector } from 'react-redux';

export function ImageListTable(props: { showImportButton: boolean }) {
  const { showImportButton } = props;

  const imageList = useSelector(selectAllImages);

  return (
    <>
      <div className="buttons-row">
        {showImportButton ? (
          <button style={{backgroundColor: 'inherit'}} disabled>Import not supported</button>
        ) : (
          <></>
        )}
        <button
          onClick={() => window.electron.exportImageListTable(imageList, true)}
        >
          Export to CSV
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>id_img</th>
            <th>name</th>
            <th>width</th>
            <th>height</th>
          </tr>
        </thead>
        <tbody>
          {imageList.map((i) => (
            <tr key={i.id}>
              <td>{i.id}</td>
              <td>{i.name}</td>
              <td>{i.width}</td>
              <td>{i.height}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
