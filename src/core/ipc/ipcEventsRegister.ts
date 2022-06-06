import { ipcMain } from 'electron';
import { openFilePicker } from './api/filePicker';
import {
  getPath,
  getSavesPath,
  readTextFile,
  copyFile,
  copyFileToSaves,
  writeTextFile,
  writeTextFileInSaves
} from './api/fs';
import { convertDataToCSV } from './api/csv';

export default function registerIpcEvents() {
  ipcMain.on('log', async (_event, arg) => {
    const msgTemplate = (message: string) => `[IPC Log] ${message}`;

    // eslint-disable-next-line no-console
    console.log(msgTemplate(arg));
  });

  // fs.ts
  ipcMain.handle('getPath:main', async (_event) => getPath());
  ipcMain.handle('getPath:saves', async (_event) => getSavesPath());
  ipcMain.handle('readTextFile', async (_event, arg) => readTextFile(arg));
  ipcMain.handle('writeTextFile', async (_event, arg1, arg2) => writeTextFile(arg1, arg2));
  ipcMain.handle('writeTextFile:saves', async (_event, arg1, arg2) => writeTextFileInSaves(arg1, arg2));
  ipcMain.handle('copyFile', async (_event, arg1, arg2) => copyFile(arg1, arg2));
  ipcMain.handle('copyFile:saves', async (_event, arg1, arg2) => copyFileToSaves(arg1, arg2));

  // csv.ts
  ipcMain.handle('convertToCSV', async (_event, arg) => convertDataToCSV(arg));

  // filePicker.ts
  ipcMain.handle('filePicker:open', async (_event, arg) => openFilePicker(arg));
}
