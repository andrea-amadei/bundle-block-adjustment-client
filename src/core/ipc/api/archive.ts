import fs from 'fs';
import { saveFilePicker } from './filePicker';
import { getMainWindow } from '../../../main/main';
import { Message } from '../../model/slices/messages/messageQueueSlice';
import { getSavesPath } from './fs';

const archiver = require('archiver');

export function zipDirectory(
  sourcePath: string,
  outputPath: string
): Promise<void> {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outputPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourcePath, false)
      .on('error', (error: Error) => reject(error))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

export function exportSavesToZip(): Promise<void> {
  return new Promise((resolve, reject) => {
    saveFilePicker({
      title: 'Save file',
      defaultPath: 'project.zip',
      filters: [
        { name: 'Zip', extensions: ['zip'] },
        { name: 'All Files', extensions: ['*'] },
      ],
      properties: ['createDirectory', 'showOverwriteConfirmation'],
    })
      .then((selectedPath) => {
        zipDirectory(getSavesPath(), selectedPath)
          .then(() => {
            getMainWindow()?.webContents.send('notify', {
              message: 'Project exported successfully',
              status: 'success',
              symbol: 'save_as',
            } as Message);

            resolve();
          })
          .catch(() => {
            getMainWindow()?.webContents.send('notify', {
              message: 'Could not export project',
              status: 'error',
              symbol: 'save_as',
            } as Message);

            reject();
          });
      })
      .catch(() => {
        getMainWindow()?.webContents.send('notify', {
          message: 'Action cancelled...',
          status: 'warning',
          symbol: 'save_as',
        } as Message);
      });
  });
}
