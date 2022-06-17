import path from 'path';
import { TiePoint } from '../../model/slices/tiePointsSlice';
import { saveFilePicker } from './filePicker';
import { convertDataToCSV } from './csv';
import { getSavesPath, writeTextFile } from './fs';
import { getMainWindow } from '../../../main/main';
import {
  CameraPosition,
  RealPoint,
} from '../../model/slices/common/interfaces';
import { GroundControlPoint } from '../../model/slices/groundControlPointsSlice';
import { Message } from '../../model/slices/messages/messageQueueSlice';
import { InputImage } from '../../model/slices/imageListSlice';

export async function exportToCSVAtPath(path: string, data: any[][], shouldNotifyOnSuccess?: boolean) {
  return convertDataToCSV(data)
    .then((result) => {
      return writeTextFile(path, [result])
        .then(() => {
          if (shouldNotifyOnSuccess)
            getMainWindow()?.webContents.send('notify', {
              message: 'File saved successfully!',
              status: 'success',
              symbol: 'save',
            } as Message);
          return path;
        })
        .catch(() => {
          getMainWindow()?.webContents.send('notify', {
            message: 'Could not save file...',
            status: 'error',
          } as Message);
        });
    })
    .catch(() => {
      getMainWindow()?.webContents.send('notify', {
        message: 'Could not convert data to CSV...',
        status: 'error',
      } as Message);
    });
}

export async function exportToCSV(defaultName: string, chooseLocation: boolean, extractor: () => any[][]) {
  (chooseLocation
    ? saveFilePicker({
        title: 'Save file',
        defaultPath: defaultName,
        filters: [
          { name: 'CSV', extensions: ['csv'] },
          { name: 'All Files', extensions: ['*'] },
        ],
        properties: ['createDirectory', 'showOverwriteConfirmation'],
      })

    : new Promise<string>((resolve) => resolve(path.join(getSavesPath(), defaultName)))
  )
    .then((selectedPath) => {
      return exportToCSVAtPath(selectedPath, extractor(), chooseLocation)
    })
    .catch(() => {
      getMainWindow()?.webContents.send('notify', {
        message: 'Action cancelled...',
        status: 'warning',
        symbol: chooseLocation ? 'save_as' : 'save',
      } as Message);
    });
}

export function exportTPImageTable(data: TiePoint[], chooseLocation: boolean) {
  exportToCSV('tp_img.csv', chooseLocation, () =>
    data.flatMap((tp) =>
      Object.entries(tp.linkedImages).map(([, p]) => [
        p.pointId,
        p.imageId,
        p.x,
        p.y,
        p.source,
      ])
    )
  );
}

export function exportGCPImageTable(data: GroundControlPoint[], chooseLocation: boolean) {
  exportToCSV('gcp_img.csv', chooseLocation, () =>
    data.flatMap((gcp) =>
      Object.entries(gcp.linkedImages).map(([, p]) => [
        p.pointId,
        p.imageId,
        p.x,
        p.y,
        p.source,
      ])
    )
  );
}

export function exportGCPObjectTable(data: GroundControlPoint[], chooseLocation: boolean) {
  exportToCSV('gcp_obj.csv', chooseLocation, () =>
    data.map((gcp) => [gcp.pointId, gcp.x, gcp.y, gcp.z])
  );
}

export function exportCameraPositionTable(data: CameraPosition[], chooseLocation: boolean) {
  exportToCSV('camera.csv', chooseLocation, () =>
    data.map((c) => [c.imageId, c.xc, c.yc, c.zc, c.omega, c.phi, c.kappa])
  );
}

export function exportPointCloudTable(data: RealPoint[], chooseLocation: boolean) {
  exportToCSV('cloud.csv', chooseLocation, () =>
    data.map((p) => [p.pointId, p.x, p.y, p.z])
  );
}

export function exportCameraSettingsTable(
  data: {
    xi0: number;
    eta0: number;
    c: number;
    k1: number;
    k2: number;
    k3: number;
    p1: number;
    p2: number;
    a1: number;
    a2: number;
  },
  chooseLocation: boolean
) {
  exportToCSV('settings.csv', chooseLocation, () =>
    [[data.xi0, data.eta0, data.c, data.k1, data.k2, data.k3, data.p1, data.p2, data.a1, data.a2]]
  );
}

export function exportImageListTable(data: InputImage[], chooseLocation: boolean) {
  exportToCSV('img_list.csv', chooseLocation, () =>
    data.map((p) => [p.id, p.name, `${path.basename(p.path)}`])
  );
}



