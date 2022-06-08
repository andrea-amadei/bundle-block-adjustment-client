// import './App.css'; // TODO enable?
import 'ui/styles/Styles.scss';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { PagesContainer } from '../ui/pages/PagesContainer';
import { EditorPage } from '../ui/pages/EditorPage';
import { DataPage } from '../ui/pages/DataPage';

export default function App() {
  useEffect(() => {
    // window.electron
    //   .openFilePicker()
    //   .then((result: string[]) => {
    //     window.electron.copyFileToSaves(result[0], 'test.txt');
    //
    //     return result[0];
    //   })
    //   .catch((error: Error) => console.log(error));

    // window.electron
    //   .writeTextFileInSaves('test.txt', ['row1', 'row2'])
    //   .then(() => console.log('DONE!'))
    //   .catch((error: Error) => console.log(error));

    window.electron.logToRenderer((_event, text: string) => console.log(text));
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PagesContainer />}>
          <Route index element={<EditorPage />} />
          <Route path="editor" element={<EditorPage />} />
          <Route path="data" element={<DataPage />} />
          <Route path="*" element={<h2>Not defined</h2>} />
        </Route>
      </Routes>
    </Router>
  );
}
