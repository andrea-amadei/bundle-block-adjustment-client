import { ipcMain } from 'electron';
import { openFilePicker, saveFilePicker } from './api/filePicker';
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
import {
  exportCameraPositionTable,
  exportCameraSettingsTable,
  exportGCPImageTable, exportGCPObjectTable, exportPointCloudTable,
  exportTPImageTable
} from './api/export';

export default function registerIpcEvents() {
  // log
  ipcMain.on('log:main', async (_event, arg) => {
    const msgTemplate = (message: string) => `[IPC Log] ${message}`;
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
  ipcMain.handle('filePicker:save', async (_event, arg) => saveFilePicker(arg));

  // export.ts
  ipcMain.on('export:tp', async (_event, arg) => exportTPImageTable(arg));
  ipcMain.on('export:gcp_img', async (_event, arg) => exportGCPImageTable(arg));
  ipcMain.on('export:gcp_obj', async (_event, arg) => exportGCPObjectTable(arg));
  ipcMain.on('export:camera', async (_event, arg) => exportCameraPositionTable(arg));
  ipcMain.on('export:cloud', async (_event, arg) => exportPointCloudTable(arg));
  ipcMain.on('export:settings', async (_event, arg) => exportCameraSettingsTable(arg));
}
