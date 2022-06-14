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

    // TODO
    window.electron.addTPImageToModel(
      (_event, data: TiePoint[], showSuccessMessage: boolean) => {
        store.dispatch(removeAllTP());

        data.forEach((tp) => store.dispatch(addPointTP(tp)));
      }
    );

    // TODO
    window.electron.addGCPImageToModel(
      (_event, data: GroundControlPoint[], showSuccessMessage: boolean) => {
        store.dispatch(removeAllLinkedImagesGCP);

        data.forEach((gcp) =>
          Object.values(gcp.linkedImages).forEach((p) =>
            store.dispatch(addLinkedPointByPointIdGCP(p))
          )
        );
      }
    );

    // TODO
    window.electron.addGCPObjectToModel(
      (_event, data: GroundControlPoint[], showSuccessMessage: boolean) => {
        store.dispatch(removeAllGCP);

        data.forEach((gcp) => store.dispatch(addPointGCP(gcp)));
      }
    );

    window.electron.addCameraPositionToModel(
      (_event, data: CameraPosition[], showSuccessMessage: boolean) => {
        importData(data, importCameras, showSuccessMessage);
      }
    );

    window.electron.addPointCloudToModel(
      (_event, data: RealPoint[], showSuccessMessage: boolean) => {
        importData(data, importPoints, showSuccessMessage);
      }
    );

    window.electron.addCameraSettingsToModel(
      (_event, data: CameraState, showSuccessMessage: boolean) => {
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

        if (showSuccessMessage)
          store.dispatch(
            addNewMessage({
              message: 'File imported successfully!',
              status: 'success',
              symbol: 'file_download',
            })
          );
      }
    );

    window.electron.addImageListToModel(
      (_event, data: InputImage[], showSuccessMessage: boolean) => {
        if (showSuccessMessage)
          store.dispatch(
            addNewMessage({
              message: 'File imported successfully!',
              status: 'success',
              symbol: 'file_download',
            })
          );

        data.forEach((x) => window.electron.importImage([x], x.id));
      }
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
