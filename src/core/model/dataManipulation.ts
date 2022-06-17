import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { store } from './store';
import { addNewMessage } from './slices/messages/messageQueueSlice';
import {
  selectA1, selectA2,
  selectC,
  selectEta0,
  selectK1,
  selectK2,
  selectK3,
  selectP1,
  selectP2, selectPixel,
  selectXi0
} from './slices/cameraSlice';
import { selectTiePointList} from './slices/tiePointsSlice';
import { selectGroundControlPointList } from './slices/groundControlPointsSlice';
import { selectAllImages } from './slices/imageListSlice';
import { selectAllCamerasList, selectAllPointsList } from "./slices/resultSlice";
import {
  importAndAddToStoreCameraPositionTable,
  importAndAddToStoreCameraSettingsTable, importAndAddToStoreGCPImageTable, importAndAddToStoreGCPObjectTable,
  importAndAddToStoreImageListTable, importAndAddToStorePointCloudTable, importAndAddToStoreTPImageTable,
} from "../../main/ImportExportFromRenderer";

export function importData<T>(data: T[], importer: ActionCreatorWithPayload<T[]>, showSuccessMessage = true) {
  try {
    store.dispatch(importer(data));

    if (showSuccessMessage)
      store.dispatch(
        addNewMessage({
          message: 'File imported successfully!',
          status: 'success',
          symbol: 'file_download',
        })
      );
  } catch (error: Error) {
    store.dispatch(
      addNewMessage({
        message: error.message,
        status: 'warning',
        symbol: 'file_download',
      })
    );
  }
}

export function saveAll(showAutosaveMessage = false) {
  const tpList = selectTiePointList(store.getState());
  const gcpList = selectGroundControlPointList(store.getState());
  const cameraList = selectAllCamerasList(store.getState());
  const imageList = selectAllImages(store.getState());

  const xi0 = selectXi0(store.getState());
  const eta0 = selectEta0(store.getState());
  const c = selectC(store.getState());
  const pixel = selectPixel(store.getState());
  const k1 = selectK1(store.getState());
  const k2 = selectK2(store.getState());
  const k3 = selectK3(store.getState());
  const p1 = selectP1(store.getState());
  const p2 = selectP2(store.getState());
  const a1 = selectA1(store.getState());
  const a2 = selectA2(store.getState());
  const cameraSettings = { xi0, eta0, c, pixel, k1, k2, k3, p1, p2, a1, a2 };

  window.electron.exportTPImageTable(tpList, false);
  window.electron.exportGCPObjectTable(gcpList, false);
  window.electron.exportGCPImageTable(gcpList, false);
  window.electron.exportCameraPositionTable(cameraList, false);
  window.electron.exportCameraSettingsTable(cameraSettings, false);
  window.electron.exportImageListTable(imageList, false);

  if (showAutosaveMessage)
    store.dispatch(addNewMessage({ message: 'Autosaving', status: 'info' }));
}

export async function importAll() {
  return importAndAddToStoreImageListTable(false)
    .then(() => importAndAddToStoreGCPObjectTable(false))
    .then(() => importAndAddToStoreGCPImageTable(false))
    .then(() => importAndAddToStoreTPImageTable(false))
    .then(() => importAndAddToStoreCameraPositionTable(false))
    .then(() => importAndAddToStoreCameraSettingsTable(false))
    // .then(() => saveAll(true));
}
