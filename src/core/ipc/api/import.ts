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


async function getPathFromUser(defaultName: string) {
  return openFilePicker({
    title: 'Open file',
    defaultPath: defaultName,
    filters: [
      { name: 'CSV', extensions: ['csv'] },
      { name: 'All Files', extensions: ['*'] },
    ],
    properties: ['openFile'],
  })
    .then((selectedPath) => {
      if (selectedPath.length !== 1) {
        getMainWindow()?.webContents.send('notify', {
          message:
            "Can only open one file at a time... (THIS SHOULDN'T BE POSSIBLE!!!)",
          status: 'warning',
          symbol: 'download',
        } as Message);
        throw Error(
          "Can only open one file at a time... (THIS SHOULDN'T BE POSSIBLE!!!)"
        );
      } else {
        return selectedPath[0];
      }
    })
    .catch(() => {
      getMainWindow()?.webContents.send('notify', {
        message: 'Action cancelled',
        status: 'warning',
        symbol: 'file_download',
      } as Message);
      throw Error('Action cancelled');
    });
}

async function getPathForFileToImport(
  defaultName: string,
  makeUserChoosePath: boolean
) {
  if (makeUserChoosePath) {
    return getPathFromUser(defaultName);
  }
  return path.join(getSavesPath(), defaultName);
}

export async function importFromCSV(
  defaultName: string,
  chooseLocation: boolean
) {
  return getPathForFileToImport(defaultName, chooseLocation)
    .then(readTextFile)
    .catch(() => {
      if (chooseLocation)
        getMainWindow()?.webContents.send('notify', {
          message: 'Could not open file',
          status: 'error',
        } as Message);
      throw Error('Could not open file');
    })
    .then(convertCSVToData)
    .catch(() => {
      getMainWindow()?.webContents.send('notify', {
        message: 'Could not import data from CSV',
        status: 'error',
      } as Message);
      throw Error('Could not import data from CSV');
    });
}

function isFieldUnique<T extends number | string>(fields: T[]): boolean {
  return (
    fields.filter((value, index, self) => self.indexOf(value) === index)
      .length === fields.length
  );
}

export async function importTPImageTable(chooseLocation: boolean) {
  return importFromCSV('tp_img.csv', chooseLocation)
    .then((data) => {
      const result: { [id: number]: TiePoint } = {};
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
      ) {
        throw Error("Inavlid row found");
      }

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
          pointId,
        };
      }
    });

    if (Object.entries(result).length === 0 && chooseLocation) {
      getMainWindow()?.webContents.send('notify', {
        message: 'File is empty',
        status: 'warning',
        symbol: 'file_download',
      } as Message);

      throw Error('File is empty');
    } else {
      return Object.values(result);
    }

  });
}

export async function importGCPImageTable(chooseLocation: boolean) {

  return importFromCSV('gcp_img.csv', chooseLocation)
    .then((data) => {
      const result: { [id: number]: GroundControlPoint } = {};
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

    if (Object.entries(result).length === 0 && chooseLocation) {
      getMainWindow()?.webContents.send('notify', {
        message: 'File is empty',
        status: 'warning',
        symbol: 'file_download',
      } as Message);
      throw Error('File is empty');
    } else {
      return Object.values(result);
    }

  });
}

export async function importGCPObjectTable(chooseLocation: boolean) {
  return importFromCSV('gcp_obj.csv', chooseLocation).then( (data) => {
    const result: GroundControlPoint[] = [];
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

    if (result.length === 0 && chooseLocation) {
      getMainWindow()?.webContents.send('notify', {
        message: 'File is empty',
        status: 'warning',
        symbol: 'file_download',
      } as Message);
      throw Error('File is empty');
    } else {
      return result;
    }

  });
}

export async function importCameraPositionTable(chooseLocation: boolean) {
  return importFromCSV('camera.csv', chooseLocation).then( (data) => {
    const result: CameraPosition[] = [];
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

    if (result.length === 0 && chooseLocation) {
      getMainWindow()?.webContents.send('notify', {
        message: 'File is empty',
        status: 'warning',
        symbol: 'file_download',
      } as Message);
      throw Error('File is empty');
    } else {
      return result;
    }

  });
}

export async function importPointCloudTable(chooseLocation: boolean) {
  return importFromCSV('cloud.csv', chooseLocation).then( (data) => {
    const result: RealPoint[] = [];
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

    if (result.length === 0 && chooseLocation) {
      getMainWindow()?.webContents.send('notify', {
        message: 'File is empty',
        status: 'warning',
        symbol: 'file_download',
      } as Message);
      throw Error('File is empty');
    } else {
      return result;
    }
  });
}

export async function importCameraSettingsTable(chooseLocation: boolean) {
  return importFromCSV('settings.csv', chooseLocation).then( (data) => {
    if (data.length === 0 && chooseLocation) {
      getMainWindow()?.webContents.send('notify', {
        message: 'File is empty',
        status: 'warning',
        symbol: 'file_download',
      } as Message);
      throw Error('File is empty');
    }

    if (data.length > 1) throw Error();

    const record = data[0];
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

    const result: CameraState = {
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

    return result;
  });
}

export async function importImageListTable(chooseLocation: boolean) {
  return importFromCSV('img_list.csv', chooseLocation).then( (data) => {
    const result: InputImage[] = [];
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

    if (result.length === 0 && chooseLocation) {
      getMainWindow()?.webContents.send('notify', {
        message: 'File is empty',
        status: 'warning',
        symbol: 'file_download',
      } as Message);
      throw Error('File is empty');
    } else {
      return result;
    }
  });
}
