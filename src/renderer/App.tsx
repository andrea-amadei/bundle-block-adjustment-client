// import './App.css'; // TODO enable?
import 'ui/styles/Styles.scss';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
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
import {
  importCameras,
  importPoints,
  selectAllCameras,
  selectAllPoints,
} from '../core/model/slices/resultSlice';
import { importAll, importData, saveAll } from '../core/model/dataManipulation';
import {
  selectTiePointList,
  TiePoint,
} from '../core/model/slices/tiePointsSlice';
import {
  GroundControlPoint,
  selectGroundControlPointList,
} from '../core/model/slices/groundControlPointsSlice';
import {
  CameraState,
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
import {
  addImage,
  InputImage,
  selectAllImages,
} from '../core/model/slices/imageListSlice';

export default function App() {
  const tpList = useSelector(selectTiePointList);
  const gcpList = useSelector(selectGroundControlPointList);

  const cameraList = useSelector(selectAllCameras);
  const pointList = useSelector(selectAllPoints);

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

  const imageList = useSelector(selectAllImages);

  useEffect(() => {
    // Register periodic events
    const autosaveInterval = setInterval(() => {
     saveAll(tpList, gcpList, cameraList, pointList, { xi0, eta0, c, k1, k2, k3, p1, p2, a1, a2 }, imageList, true);
    }, 60 * 1000);

    // Register IPC methods
    window.electron.logToRenderer((_event, text: string) => console.log(text));

    window.electron.addNotification((_event, message: Message) =>
      store.dispatch(addNewMessage(message))
    );

    // TODO
    window.electron.addTPImageToModel(
      (_event, data: TiePoint[], showSuccessMessage: boolean) => {
        data.forEach((r) => console.log(r));
      }
    );

    // TODO
    window.electron.addGCPImageToModel(
      (_event, data: GroundControlPoint[], showSuccessMessage: boolean) => {
        data.forEach((r) => console.log(r));
      }
    );

    // TODO
    window.electron.addGCPObjectToModel(
      (_event, data: GroundControlPoint[], showSuccessMessage: boolean) => {
        data.forEach((r) => console.log(r));
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
