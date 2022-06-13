import path from 'path';
import { openFilePicker } from './filePicker';
import { getSavesPath, readTextFile } from './fs';
import { getMainWindow } from '../../../main/main';
import { Message } from '../../model/slices/messages/messageQueueSlice';
import { convertCSVToData, validateRow } from './csv';
import {
  CameraPosition,
  RealPoint,
} from '../../model/slices/common/interfaces';
import { TiePoint } from '../../model/slices/tiePointsSlice';
import { GroundControlPoint } from '../../model/slices/groundControlPointsSlice';
import { CameraState } from '../../model/slices/cameraSlice';
import { InputImage } from '../../model/slices/imageListSlice';

export async function importFromCSV(
  defaultName: string,
  chooseLocation: boolean,
  injector: (data: string[][]) => void
) {
  (chooseLocation
    ? openFilePicker({
        title: 'Open file',
        defaultPath: defaultName,
        filters: [
          { name: 'CSV', extensions: ['csv'] },
          { name: 'All Files', extensions: ['*'] },
        ],
        properties: ['openFile'],
      })
    : new Promise<string[]>((resolve) =>
        resolve([path.join(getSavesPath(), defaultName)])
      )
  )
    .then((selectedPath) => {
      if (selectedPath.length !== 1) {
        getMainWindow()?.webContents.send('notify', {
          message:
            "Can only open one file at a time... (THIS SHOULDN'T BE POSSIBLE!!!)",
          status: 'warning',
          symbol: 'download',
        } as Message);
      } else {
        readTextFile(
          typeof selectedPath === 'string' ? selectedPath : selectedPath[0]
        )
          .then((result: string) => {
            convertCSVToData(result)
              .then((data: string[][]) => {
                try {
                  injector(data);
                } catch (error) {
                  getMainWindow()?.webContents.send('notify', {
                    message: 'CSV data is invalid and could not be imported',
                    status: 'error',
                  } as Message);
                }
              })
              .catch(() => {
                getMainWindow()?.webContents.send('notify', {
                  message: 'Could not import data from CSV',
                  status: 'error',
                } as Message);
              });
          })
          .catch(() => {
            getMainWindow()?.webContents.send('notify', {
              message: 'Could not open file',
              status: 'error',
            } as Message);
          });
      }
    })
    .catch(() => {
      getMainWindow()?.webContents.send('notify', {
        message: 'Action cancelled',
        status: 'warning',
        symbol: 'file_download',
      } as Message);
    });
}

function isFieldUnique<T extends number | string>(fields: T[]): boolean {
  return (
    fields.filter((value, index, self) => self.indexOf(value) === index)
      .length === fields.length
  );
}

export function importTPImageTable(chooseLocation: boolean) {
  const result: { [id: number]: TiePoint } = {};

  importFromCSV('tp_img.csv', chooseLocation, (data: string[][]) => {
    data.forEach((record: string[]) => {
      if (
        !validateRow(record, [
          { type: 'int', validator: (x) => x >= 0 },
          { type: 'int', validator: (x) => x >= 0 },
          { type: 'float', validator: () => true },
          { type: 'float', validator: () => true },
          {
            type: 'string',
            validator: (x) =>
              ['MANUAL', 'AUTO', 'IMPORTED'].includes(String(x).toUpperCase()),
          },
        ])
      )
        throw Error();

      const pointId = parseInt(record[0], 10);
      const imageId = parseInt(record[1], 10);

      if (pointId in result) {
        if (imageId in result[pointId].linkedImages) throw Error();
        // Duplicate imageId on same point
        else
          result[pointId].linkedImages[imageId] = {
            imageId,
            pointId,
            x: parseFloat(record[2]),
            y: parseFloat(record[3]),
            source: record[4] as 'MANUAL' | 'AUTO' | 'IMPORTED',
          };
      } else {
        result[pointId] = {
          linkedImages: {
            [imageId]: {
              imageId,
              pointId,
              x: parseFloat(record[2]),
              y: parseFloat(record[3]),
              source: record[4] as 'MANUAL' | 'AUTO' | 'IMPORTED',
            },
          },
          pointId: pointId,
        };
      }
    });

    if (Object.entries(result).length === 0) {
      getMainWindow()?.webContents.send('notify', {
        message: 'File is empty',
        status: 'warning',
        symbol: 'file_download',
      } as Message);

      return;
    }

    getMainWindow()?.webContents.send(
      'addToModel:tp',
      Object.entries(result).map((x) => x[1]),
      chooseLocation
    );
  });
}

export function importGCPImageTable(chooseLocation: boolean) {
  const result: { [id: number]: GroundControlPoint } = {};

  importFromCSV('gcp_img.csv', chooseLocation, (data: string[][]) => {
    data.forEach((record: string[]) => {
      if (
        !validateRow(record, [
          { type: 'int', validator: (x) => x >= 0 },
          { type: 'int', validator: (x) => x >= 0 },
          { type: 'float', validator: () => true },
          { type: 'float', validator: () => true },
          {
            type: 'string',
            validator: (x) =>
              ['MANUAL', 'IMPORTED'].includes(String(x).toUpperCase()),
          },
        ])
      )
        throw Error();

      const pointId = parseInt(record[0], 10);
      const imageId = parseInt(record[1], 10);

      if (pointId in result) {
        if (imageId in result[pointId].linkedImages) throw Error();
        // Duplicate imageId on same point
        else
          result[pointId].linkedImages[imageId] = {
            imageId,
            pointId,
            x: parseFloat(record[2]),
            y: parseFloat(record[3]),
            source: record[4] as 'MANUAL' | 'IMPORTED',
          };
      } else {
        result[pointId] = {
          linkedImages: {
            [imageId]: {
              imageId,
              pointId,
              x: parseFloat(record[2]),
              y: parseFloat(record[3]),
              source: record[4] as 'MANUAL' | 'IMPORTED',
            },
          },
          pointId,
          x: 0,
          y: 0,
          z: 0,
        };
      }
    });

    if (Object.entries(result).length === 0) {
      getMainWindow()?.webContents.send('notify', {
        message: 'File is empty',
        status: 'warning',
        symbol: 'file_download',
      } as Message);

      return;
    }

    getMainWindow()?.webContents.send(
      'addToModel:gcp_img',
      Object.entries(result).map((x) => x[1]),
      chooseLocation
    );
  });
}

export function importGCPObjectTable(chooseLocation: boolean) {
  const result: GroundControlPoint[] = [];

  importFromCSV('gcp_obj.csv', chooseLocation, (data: string[][]) => {
    data.forEach((record: string[]) => {
      if (
        !validateRow(record, [
          { type: 'int', validator: (x) => x >= 0 },
          { type: 'float', validator: () => true },
          { type: 'float', validator: () => true },
          { type: 'float', validator: () => true },
        ])
      )
        throw Error();

      result.push({
        pointId: parseInt(record[0], 10),
        x: parseFloat(record[1]),
        y: parseFloat(record[2]),
        z: parseFloat(record[3]),
        linkedImages: {},
      });
    });

    // Check if every imageId is unique
    if (!isFieldUnique(result.map((c) => c.pointId))) throw Error();

    if (result.length === 0) {
      getMainWindow()?.webContents.send('notify', {
        message: 'File is empty',
        status: 'warning',
        symbol: 'file_download',
      } as Message);

      return;
    }

    getMainWindow()?.webContents.send(
      'addToModel:gcp_obj',
      result,
      chooseLocation
    );
  });
}

export function importCameraPositionTable(chooseLocation: boolean) {
  const result: CameraPosition[] = [];

  importFromCSV('camera.csv', chooseLocation, (data: string[][]) => {
    data.forEach((record: string[]) => {
      if (
        !validateRow(record, [
          { type: 'int', validator: (x) => x >= 0 },
          { type: 'float', validator: () => true },
          { type: 'float', validator: () => true },
          { type: 'float', validator: () => true },
          { type: 'float', validator: () => true },
          { type: 'float', validator: () => true },
          { type: 'float', validator: () => true },
        ])
      )
        throw Error();

      result.push({
        imageId: parseInt(record[0], 10),
        xc: parseFloat(record[1]),
        yc: parseFloat(record[2]),
        zc: parseFloat(record[3]),
        omega: parseFloat(record[4]),
        phi: parseFloat(record[5]),
        kappa: parseFloat(record[6]),
      });
    });

    // Check if every imageId is unique
    if (!isFieldUnique(result.map((c) => c.imageId))) throw Error();

    if (result.length === 0) {
      getMainWindow()?.webContents.send('notify', {
        message: 'File is empty',
        status: 'warning',
        symbol: 'file_download',
      } as Message);

      return;
    }

    getMainWindow()?.webContents.send(
      'addToModel:camera',
      result,
      chooseLocation
    );
  });
}

export function importPointCloudTable(chooseLocation: boolean) {
  const result: RealPoint[] = [];

  importFromCSV('cloud.csv', chooseLocation, (data: string[][]) => {
    data.forEach((record: string[]) => {
      if (
        !validateRow(record, [
          { type: 'int', validator: (x) => x >= 0 },
          { type: 'float', validator: () => true },
          { type: 'float', validator: () => true },
          { type: 'float', validator: () => true },
        ])
      )
        throw Error();

      result.push({
        pointId: parseInt(record[0], 10),
        x: parseFloat(record[1]),
        y: parseFloat(record[2]),
        z: parseFloat(record[3]),
      });
    });

    // Check if every imageId is unique
    if (!isFieldUnique(result.map((c) => c.pointId))) throw Error();

    if (result.length === 0) {
      getMainWindow()?.webContents.send('notify', {
        message: 'File is empty',
        status: 'warning',
        symbol: 'file_download',
      } as Message);

      return;
    }

    getMainWindow()?.webContents.send(
      'addToModel:cloud',
      result,
      chooseLocation
    );
  });
}

export function importCameraSettingsTable(chooseLocation: boolean) {
  let result: CameraState;

  importFromCSV('settings.csv', chooseLocation, (data: string[][]) => {
    if (data.length === 0) {
      getMainWindow()?.webContents.send('notify', {
        message: 'File is empty',
        status: 'warning',
        symbol: 'file_download',
      } as Message);

      return;
    }

    if (data.length > 1) throw Error();

    data.forEach((record: string[]) => {
      if (
        !validateRow(record, [
          { type: 'float', validator: () => true },
          { type: 'float', validator: () => true },
          { type: 'float', validator: () => true },
          { type: 'float', validator: () => true },
          { type: 'float', validator: () => true },
          { type: 'float', validator: () => true },
          { type: 'float', validator: () => true },
          { type: 'float', validator: () => true },
          { type: 'float', validator: () => true },
          { type: 'float', validator: () => true },
        ])
      )
        throw Error();

      result = {
        xi0: parseInt(record[0], 10),
        eta0: parseInt(record[1], 10),
        c: parseInt(record[2], 10),
        k1: parseInt(record[3], 10),
        k2: parseInt(record[4], 10),
        k3: parseInt(record[5], 10),
        p1: parseInt(record[6], 10),
        p2: parseInt(record[7], 10),
        a1: parseInt(record[8], 10),
        a2: parseInt(record[9], 10),
      } as CameraState;
    });

    getMainWindow()?.webContents.send(
      'addToModel:settings',
      result,
      chooseLocation
    );
  });
}

export function importImageListTable(chooseLocation: boolean) {
  const result: InputImage[] = [];

  importFromCSV('img_list.csv', chooseLocation, (data: string[][]) => {
    data.forEach((record: string[]) => {
      if (
        !validateRow(record, [
          { type: 'int', validator: (x) => x >= 0 },
          { type: 'string', validator: () => true },
          { type: 'string', validator: () => true },
        ])
      )
        throw Error();

      result.push({
        id: parseInt(record[0], 10),
        name: record[1],
        path: record[2],
        width: 0,
        height: 0,
      });
    });

    // Check if every imageId is unique
    if (!isFieldUnique(result.map((c) => c.id))) throw Error();

    if (result.length === 0) {
      getMainWindow()?.webContents.send('notify', {
        message: 'File is empty',
        status: 'warning',
        symbol: 'file_download',
      } as Message);

      return;
    }

    getMainWindow()?.webContents.send(
      'addToModel:img_list',
      result,
      chooseLocation
    );
  });
}
