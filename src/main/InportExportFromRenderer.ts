import { addPoint as addPointTP, removeAll as removeAllTP, TiePoint } from "../core/model/slices/tiePointsSlice";
import { store } from "../core/model/store";
import {
  addLinkedPointByPointId as addLinkedPointByPointIdGCP, addPoint as addPointGCP,
  GroundControlPoint, removeAll as removeAllGCP,
  removeAllLinkedImages as removeAllLinkedImagesGCP
} from "../core/model/slices/groundControlPointsSlice";
import { CameraPosition, RealPoint } from "../core/model/slices/common/interfaces";
import { importData } from "../core/model/dataManipulation";
import { importCameras, importPoints } from "../core/model/slices/resultSlice";
import {
  CameraState, setA1, setA2,
  setC,
  setEta0,
  setK1,
  setK2,
  setK3,
  setP1,
  setP2,
  setXi0
} from "../core/model/slices/cameraSlice";
import { InputImage } from "../core/model/slices/imageListSlice";
import { addNewMessage } from "../core/model/slices/messages/messageQueueSlice";

function notifyError(fileName: string, error: any) {
  store.dispatch(
    addNewMessage({
      message: `Error importing file ${fileName}\nError message: ${'message' in error ? error.message : error}`,
      status: 'warning',
      symbol: 'file_download',
    })
  );
}

function notifySuccess(fileName: string) {
  store.dispatch(
    addNewMessage({
      message: `File ${fileName} imported successfully!`,
      status: 'success',
      symbol: 'file_download',
    })
  )
}

async function handleImport(fileName: string, shouldNotifySuccess: boolean | undefined, promise: Promise<any>) {
  return promise.then(() => {
    if(notifySuccess) {
      notifySuccess(fileName);
    }
  }).catch((reason: any) => notifyError(fileName, reason));
}

// TODO: fix to many dispatches called
export async function importAndAddToStoreTPImageTable(chooseLocation: boolean, shouldNotifySuccess?: boolean) {
  return handleImport(
    "TP image coordinates",
    shouldNotifySuccess,
    window.electron.importTPImageTable(chooseLocation)
    .then((data: TiePoint[]) => {
      store.dispatch(removeAllTP());
      data.forEach((tp) => store.dispatch(addPointTP(tp)));
    })
  );
}

// TODO: fix to many dispatches called
export async function importAndAddToStoreGCPImageTable(chooseLocation: boolean, shouldNotifySuccess?: boolean) {
  return handleImport(
    "GCP image coordinates",
    shouldNotifySuccess,
    window.electron.importGCPImageTable(chooseLocation)
    .then((data: GroundControlPoint[]) => {
      store.dispatch(removeAllLinkedImagesGCP);
      data.forEach((gcp) =>
        Object.values(gcp.linkedImages).forEach((p) =>
          store.dispatch(addLinkedPointByPointIdGCP(p))
        )
      );
    })
  );
}

// TODO: fix to many dispatches called
export async function importAndAddToStoreGCPObjectTable(chooseLocation: boolean, shouldNotifySuccess?: boolean) {
  return handleImport(
    "GCP space coordinates",
    shouldNotifySuccess,
    window.electron.importGCPObjectTable(chooseLocation)
    .then((data: GroundControlPoint[]) => {
      store.dispatch(removeAllGCP);
      data.forEach((gcp) => store.dispatch(addPointGCP(gcp)));
    })
  );
}

export async function importAndAddToStoreCameraPositionTable(chooseLocation: boolean, shouldNotifySuccess?: boolean) {
  return handleImport(
    "Cameras position",
    shouldNotifySuccess,
    window.electron.importCameraPositionTable(chooseLocation)
    .then((data: CameraPosition[]) => {
      importData(data, importCameras, true);
    })
  );
}

export async function importAndAddToStorePointCloudTable(chooseLocation: boolean, shouldNotifySuccess?: boolean) {
  return handleImport(
    "Point Cloud table",
    shouldNotifySuccess,
    window.electron.importPointCloudTable(chooseLocation)
    .then((data: RealPoint[]) => {
      importData(data, importPoints, true);
    });
}

export async function importAndAddToStoreCameraSettingsTable(chooseLocation: boolean, shouldNotifySuccess?: boolean) {
  return handleImport(
    "Cameras parameters",
    shouldNotifySuccess,
    window.electron.importCameraSettingsTable(chooseLocation)
    .then((data: CameraState) => {
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
    })
  );
}

export async function importAndAddToStoreImageListTable(chooseLocation: boolean, shouldNotifySuccess?: boolean) {
  return handleImport(
    "",
    shouldNotifySuccess,
    window.electron.importImageListTable(chooseLocation)
    .then((data: InputImage[]) => {
      data.forEach((x) => window.electron.importImage([x], x.id));
    })
  );
}
