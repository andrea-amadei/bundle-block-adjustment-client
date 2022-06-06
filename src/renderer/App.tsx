// import './App.css'; // TODO enable?
import 'ui/styles/Styles.scss';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { PagesContainer } from '../ui/pages/PagesContainer';
import { EditorPage } from '../ui/pages/EditorPage';
import { DataPage } from '../ui/pages/DataPage';
import { RedirectToFirstImageInEditor } from '../utils/RedirectToFirstImageInEditor';
import { TestPage } from 'ui/pages/TestPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PagesContainer />}>
          <Route index element={<RedirectToFirstImageInEditor />} />
          <Route path="editor" element={<EditorPage />} />
          <Route path="data" element={<DataPage />} />
          <Route path="test" element={<TestPage />} />
          <Route path="*" element={<h2>Not defined</h2>} />
        </Route>
      </Routes>
    </Router>
  );
}
