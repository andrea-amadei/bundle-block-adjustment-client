import { ipcMain } from 'electron';
import { openFilePicker, saveFilePicker } from './api/filePicker';
import {
  getPath,
  getSavesPath,
  readTextFile,
  copyFile,
  copyFileToSaves,
  writeTextFile,
  writeTextFileInSaves, removeFile, removeFileInSaves, removeImage
} from './api/fs';
import { convertDataToCSV } from './api/csv';
import {
  exportCameraPositionTable,
  exportCameraSettingsTable,
  exportGCPImageTable,
  exportGCPObjectTable, exportImageListTable,
  exportPointCloudTable,
  exportTPImageTable
} from './api/export';
import {
  importCameraPositionTable, importCameraSettingsTable,
  importGCPImageTable,
  importGCPObjectTable, importImageListTable,
  importPointCloudTable,
  importTPImageTable
} from './api/import';
import { importImage } from './api/images';

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
  ipcMain.handle('removeFile', async (_event, arg) => removeFile(arg));
  ipcMain.handle('removeFile:saves', async (_event, arg) => removeFileInSaves(arg));
  ipcMain.handle('removeFile:images', async (_event, arg) => removeImage(arg));

  // csv.ts
  ipcMain.handle('convertToCSV', async (_event, arg) => convertDataToCSV(arg));

  // filePicker.ts
  ipcMain.handle('filePicker:open', async (_event, arg) => openFilePicker(arg));
  ipcMain.handle('filePicker:save', async (_event, arg) => saveFilePicker(arg));

  // export.ts
  ipcMain.on('export:tp', async (_event, arg1, arg2) => exportTPImageTable(arg1, arg2));
  ipcMain.on('export:gcp_img', async (_event, arg1, arg2) => exportGCPImageTable(arg1, arg2));
  ipcMain.on('export:gcp_obj', async (_event, arg1, arg2) => exportGCPObjectTable(arg1, arg2));
  ipcMain.on('export:camera', async (_event, arg1, arg2) => exportCameraPositionTable(arg1, arg2));
  ipcMain.on('export:cloud', async (_event, arg1, arg2) => exportPointCloudTable(arg1, arg2));
  ipcMain.on('export:settings', async (_event, arg1, arg2) => exportCameraSettingsTable(arg1, arg2));
  ipcMain.on('export:img_list', async (_event, arg1, arg2) => exportImageListTable(arg1, arg2));

  // import.ts
  ipcMain.on('import:tp', async (_event, arg) => importTPImageTable(arg));
  ipcMain.on('import:gcp_img', async (_event, arg) => importGCPImageTable(arg));
  ipcMain.on('import:gcp_obj', async (_event, arg) => importGCPObjectTable(arg));
  ipcMain.on('import:camera', async (_event, arg) => importCameraPositionTable(arg));
  ipcMain.on('import:cloud', async (_event, arg) => importPointCloudTable(arg));
  ipcMain.on('import:settings', async (_event, arg) => importCameraSettingsTable(arg));
  ipcMain.on('import:img_list', async (_event, arg) => importImageListTable(arg));

  // images.ts
  ipcMain.on('import:image', async (_event, arg1, arg2) => importImage(arg1, arg2));
}
