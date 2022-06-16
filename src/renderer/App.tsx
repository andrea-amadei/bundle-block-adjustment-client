// import './App.css'; // TODO enable?
import 'ui/styles/Styles.scss';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { PagesContainer } from '../ui/pages/PagesContainer';
import { EditorPage } from '../ui/pages/EditorPage';
import { DataPage } from '../ui/pages/DataPage';
import {
  addNewMessage,
  Message,
} from '../core/model/slices/messages/messageQueueSlice';
import { NotificationBanner } from '../ui/components/common/NotificationBanner';
import { TestingPage } from '../ui/pages/TestingPage';
import { store } from '../core/model/store';
import { importAll, saveAll } from '../core/model/dataManipulation';
import { addImage, InputImage } from '../core/model/slices/imageListSlice';
import { ComputePage } from '../ui/pages/ComputePage';

export default function App() {
  useEffect(() => {
    const autosaveInterval = setInterval(() => {
      saveAll(false);
    }, 60 * 1000);

    // Register IPC methods
    window.electron.logToRenderer((_event, text: string) => console.log(text));

    window.electron.addNotification((_event, message: Message) =>
      store.dispatch(addNewMessage(message))
    );

    window.electron.addImageToModel((_event, data: InputImage) => {
      store.dispatch(addImage(data));
    });

    window.electron.doSaveAll( (_event) => saveAll(true));

    importAll();

    return () => {
      clearInterval(autosaveInterval);
    };
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<PagesContainer />}>
            <Route index element={<EditorPage />} />
            <Route path="editor" element={<EditorPage />} />
            <Route path="data" element={<DataPage />} />
            <Route path="results" element={<ComputePage />} />
            <Route path="testing" element={<TestingPage />} />
            <Route path="*" element={<h2>Not defined</h2>} />
          </Route>
        </Routes>
      </Router>
      <NotificationBanner />
    </>
  );
}
