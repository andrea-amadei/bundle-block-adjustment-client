import { TiePoint } from '../../model/slices/tiePointsSlice';
import { openFilePicker, saveFilePicker } from './filePicker';
import { convertDataToCSV } from './csv';
import { writeTextFile } from './fs';
import { getMainWindow } from '../../../main/main';
import { CameraPosition, RealPoint } from '../../model/slices/common/interfaces';
import { GroundControlPoint } from '../../model/slices/groundControlPointsSlice';

export async function exportToCSV(defaultName: string, extractor: () => any[][]) {
  saveFilePicker({
    title: 'Save file',
    defaultPath: defaultName,
    filters: [
      { name: 'CSV', extensions: ['cvs'] },
      { name: 'All Files', extensions: ['*'] },
    ],
    properties: ['createDirectory', 'showOverwriteConfirmation'],
  })
    .then((selectedPath) => {
      convertDataToCSV(extractor())
        .then((result) => {
          writeTextFile(selectedPath, [result])
            .then(() => {
              getMainWindow()?.webContents.send('log:renderer','saved');
            })
            .catch((error: Error) => {
              getMainWindow()?.webContents.send('log:renderer', error.message);
            });
        })
        .catch((error) => {
          getMainWindow()?.webContents.send('log:renderer', error.message);
        });
    })
    .catch((error: Error) => {
      getMainWindow()?.webContents.send('log:renderer', error.message);
    });
}

export function exportTPImageTable(data: TiePoint[]) {
  exportToCSV('tp_img.csv', () =>
    data.flatMap((tp) =>
      tp.linkedPoints.map((lp) => [
        tp.pointId,
        lp.imageId,
        lp.x,
        lp.y,
        lp.source,
      ])
    )
  );
}

export function exportGCPImageTable(data: GroundControlPoint[]) {
  exportToCSV('gcp_img.csv', () =>
    data.flatMap((gcp) =>
      gcp.linkedPoints.map((lp) => [
        gcp.pointId,
        lp.imageId,
        lp.x,
        lp.y,
        lp.source,
      ])
    )
  );
}

export function exportGCPObjectTable(data: GroundControlPoint[]) {
  exportToCSV('gcp_obj.csv', () =>
    data.map((gcp) => [gcp.pointId, gcp.x, gcp.y, gcp.z])
  );
}

export function exportCameraPositionTable(data: CameraPosition[]) {
  exportToCSV('camera.csv', () =>
    data.map((c) => [c.imageId, c.xc, c.yc, c.zc, c.omega, c.phi, c.kappa])
  );
}

export function exportPointCloudTable(data: RealPoint[]) {
  exportToCSV('cloud.csv', () =>
    data.map((p) => [p.pointId, p.x, p.y, p.z])
  );
}

export function exportCameraSettingsTable(data: {
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
}) {
  exportToCSV('settings.csv', () =>
    [[data.xi0, data.eta0, data.c, data.k1, data.k2, data.k3, data.p1, data.p2, data.a1, data.a2]]
  );
}
