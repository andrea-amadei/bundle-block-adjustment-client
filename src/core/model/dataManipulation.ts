import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { store } from './store';
import { addNewMessage } from './slices/messages/messageQueueSlice';
import { CameraState } from './slices/cameraSlice';
import { TiePoint } from './slices/tiePointsSlice';
import { GroundControlPoint } from './slices/groundControlPointsSlice';
import { CameraPosition, RealPoint } from './slices/common/interfaces';

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

export function saveAll(
  tpList: TiePoint[],
  gcpList: GroundControlPoint[],
  cameraList: CameraPosition[],
  pointList: RealPoint[],
  cameraSettings: CameraState,
  showAutosaveMessage = false
) {
  window.electron.exportTPImageTable(tpList, false);
  window.electron.exportGCPObjectTable(gcpList, false);
  window.electron.exportGCPImageTable(gcpList, false);
  window.electron.exportCameraPositionTable(cameraList, false);
  window.electron.exportPointCloudTable(pointList, false);
  window.electron.exportCameraSettingsTable(cameraSettings, false);

  if (showAutosaveMessage)
    store.dispatch(addNewMessage({ message: 'Autosaving', status: 'info' }));
}
