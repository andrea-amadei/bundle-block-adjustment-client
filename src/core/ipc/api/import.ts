import path from 'path';
import { openFilePicker } from './filePicker';
import { getSavesPath, readTextFile } from './fs';
import { getMainWindow } from '../../../main/main';
import { Message } from '../../model/slices/messages/messageQueueSlice';
import { convertCSVToData, validateRow } from './csv';
import { CameraPosition } from '../../model/slices/common/interfaces';

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
    : new Promise<string>((resolve) =>
        resolve(path.join(getSavesPath(), defaultName))
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
                    message: 'CSV data is invalid and could not be imported...',
                    status: 'error',
                  } as Message);
                }
              })
              .catch(() => {
                getMainWindow()?.webContents.send('notify', {
                  message: 'Could not import data from CSV...',
                  status: 'error',
                } as Message);
              });
          })
          .catch(() => {
            getMainWindow()?.webContents.send('notify', {
              message: 'Could not open file...',
              status: 'error',
            } as Message);
          });
      }
    })
    .catch(() => {
      getMainWindow()?.webContents.send('notify', {
        message: 'Action cancelled...',
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
        message: 'File is empty...',
        status: 'warning',
        symbol: 'file_download',
      } as Message);

      return;
    }

    getMainWindow()?.webContents.send('addToModel:camera', result);
  });
}
