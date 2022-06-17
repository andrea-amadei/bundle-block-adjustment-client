import { ipcMain } from 'electron';
import { openFilePicker, saveFilePicker } from './api/filePicker';
import {
  getPath,
  getSavesPath,
  readTextFile,
  copyFile,
  copyFileToSaves,
  writeTextFile,
  writeTextFileInSaves,
  removeFile,
  removeFileInSaves,
  removeImage,
} from './api/fs';
import { convertDataToCSV } from './api/csv';
import {
  exportCameraPositionTable,
  exportCameraSettingsTable,
  exportGCPImageTable,
  exportGCPObjectTable,
  exportImageListTable,
  exportPointCloudTable,
  exportTPImageTable,
} from './api/export';
import {
  addNewImagesWithSelectionPopup,
  importCameraPositionTable,
  importCameraSettingsTable,
  importGCPImageTable,
  importGCPObjectTable,
  importImageListTable,
  importTPImageTable
} from './api/import';
import { ComputationParamsMap } from '../../ui/components/common/OptionParams';
import { computeResults, ComputeResultsInputData } from './api/ComputeResults';
import { exportSavesToZip } from './api/archive';

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
  ipcMain.handle('writeTextFile', async (_event, arg1, arg2) =>
    writeTextFile(arg1, arg2)
  );
  ipcMain.handle('writeTextFile:saves', async (_event, arg1, arg2) =>
    writeTextFileInSaves(arg1, arg2)
  );
  ipcMain.handle('copyFile', async (_event, arg1, arg2) =>
    copyFile(arg1, arg2)
  );
  ipcMain.handle('copyFile:saves', async (_event, arg1, arg2) =>
    copyFileToSaves(arg1, arg2)
  );
  ipcMain.handle('removeFile', async (_event, arg) => removeFile(arg));
  ipcMain.handle('removeFile:saves', async (_event, arg) =>
    removeFileInSaves(arg)
  );
  ipcMain.handle('removeFile:images', async (_event, arg) => removeImage(arg));

  // csv.ts
  ipcMain.handle('convertToCSV', async (_event, arg) => convertDataToCSV(arg));

  // filePicker.ts
  ipcMain.handle('filePicker:open', async (_event, arg) => openFilePicker(arg));
  ipcMain.handle('filePicker:save', async (_event, arg) => saveFilePicker(arg));

  // export.ts
  ipcMain.on('export:tp', async (_event, arg1, arg2) =>
    exportTPImageTable(arg1, arg2)
  );
  ipcMain.on('export:gcp_img', async (_event, arg1, arg2) =>
    exportGCPImageTable(arg1, arg2)
  );
  ipcMain.on('export:gcp_obj', async (_event, arg1, arg2) =>
    exportGCPObjectTable(arg1, arg2)
  );
  ipcMain.on('export:camera', async (_event, arg1, arg2) =>
    exportCameraPositionTable(arg1, arg2)
  );
  ipcMain.on('export:settings', async (_event, arg1, arg2) =>
    exportCameraSettingsTable(arg1, arg2)
  );
  ipcMain.on('export:img_list', async (_event, arg1, arg2) =>
    exportImageListTable(arg1, arg2)
  );

  // import.ts
  ipcMain.handle('import:tp', async (_event, arg) => importTPImageTable(arg));
  ipcMain.handle('import:gcp_img', async (_event, arg) =>
    importGCPImageTable(arg)
  );
  ipcMain.handle('import:gcp_obj', async (_event, arg) =>
    importGCPObjectTable(arg)
  );
  ipcMain.handle('import:camera', async (_event, arg) =>
    importCameraPositionTable(arg)
  );
  ipcMain.handle('import:settings', async (_event, arg) =>
    importCameraSettingsTable(arg)
  );
  ipcMain.handle('import:img_list', async (_event, arg) =>
    importImageListTable(arg)
  );

  // images.ts
  ipcMain.handle(
    'import:addNewImagesWithSelectionPopup',
    async (_event, newImagesStartIndex) =>
      addNewImagesWithSelectionPopup(newImagesStartIndex)
  );

  // computeResults.ts
  ipcMain.handle(
    'computeResults:run',
    async (
      _event,
      dirPath: string,
      inputData: ComputeResultsInputData,
      cmdArgs: ComputationParamsMap
    ) => computeResults(dirPath, inputData, cmdArgs)
  );

  // archive.ts
  ipcMain.on('exportToZip', async (_event) => exportSavesToZip());
}
