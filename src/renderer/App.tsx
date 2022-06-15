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
import {
  CameraPosition,
  RealPoint,
} from '../core/model/slices/common/interfaces';
import { importCameras, importPoints } from '../core/model/slices/resultSlice';
import { importAll, importData } from '../core/model/dataManipulation';
import {
  addPoint as addPointTP,
  removeAll as removeAllTP,
  TiePoint,
} from '../core/model/slices/tiePointsSlice';
import {
  GroundControlPoint,
  removeAll as removeAllGCP,
  addPoint as addPointGCP,
  addLinkedPointByPointId as addLinkedPointByPointIdGCP,
  removeAllLinkedImages as removeAllLinkedImagesGCP,
} from '../core/model/slices/groundControlPointsSlice';
import {
  CameraState,
  setA1,
  setA2,
  setC,
  setEta0,
  setK1,
  setK2,
  setK3,
  setP1,
  setP2,
  setXi0,
} from '../core/model/slices/cameraSlice';
import { addImage, InputImage } from '../core/model/slices/imageListSlice';
import { ResultsPage } from "../ui/pages/ResultsPage";
import { ComputePage } from '../ui/pages/ComputePage';

export default function App() {
  useEffect(() => {
    const autosaveInterval = setInterval(() => {
      // saveAll(true);
    }, 30 * 1000);

    // Register IPC methods
    window.electron.logToRenderer((_event, text: string) => console.log(text));

    window.electron.addNotification((_event, message: Message) =>
      store.dispatch(addNewMessage(message))
    );

    window.electron.addImageToModel((_event, data: InputImage) => {
      store.dispatch(addImage(data));
    });

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
