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
import importData from '../core/model/dataImport';
import { TiePoint } from '../core/model/slices/tiePointsSlice';
import { GroundControlPoint } from '../core/model/slices/groundControlPointsSlice';
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

export default function App() {
  useEffect(() => {
    window.electron.logToRenderer((_event, text: string) => console.log(text));

    window.electron.addNotification((_event, message: Message) =>
      store.dispatch(addNewMessage(message))
    );

    // TODO
    window.electron.addTPImageToModel(
      (_event, data: TiePoint[]) => {
        data.forEach((r) => console.log(r))
      }
    );

    // TODO
    window.electron.addGCPImageToModel(
      (_event, data: GroundControlPoint[]) => {
        data.forEach((r) => console.log(r));
      }
    );

    // TODO
    window.electron.addGCPObjectToModel(
      (_event, data: GroundControlPoint[]) => {
        data.forEach((r) => console.log(r));
      }
    );

    window.electron.addCameraPositionToModel(
      (_event, data: CameraPosition[]) => {
        importData(data, importCameras);
      }
    );

    window.electron.addPointCloudToModel(
      (_event, data: RealPoint[]) => {
        importData(data, importPoints);
      }
    );

    window.electron.addCameraSettingsToModel((_event, data: CameraState) => {
      store.dispatch(setXi0(data.xi0));
      store.dispatch(setEta0(data.eta0));
      store.dispatch(setC(data.c));
      store.dispatch(setK1(data.k1));
      store.dispatch(setK2(data.k2));
      store.dispatch(setK3(data.k3));
      store.dispatch(setP1(data.p1));
      store.dispatch(setP2(data.p2));
      store.dispatch(setA1(data.a1));
      store.dispatch(setA2(data.a2));

      store.dispatch(
        addNewMessage({
          message: 'File imported successfully!',
          status: 'success',
          symbol: 'file_download',
        })
      );
    });
  });

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<PagesContainer />}>
            <Route index element={<EditorPage />} />
            <Route path="editor" element={<EditorPage />} />
            <Route path="data" element={<DataPage />} />
            <Route path="results" element={<h1>In development</h1>} />
            <Route path="testing" element={<TestingPage />} />
            <Route path="*" element={<h2>Not defined</h2>} />
          </Route>
        </Routes>
      </Router>
      <NotificationBanner />
    </>
  );
}
