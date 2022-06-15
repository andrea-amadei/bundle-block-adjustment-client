const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // MAIN -> RENDER
  logToRenderer: (callback) => ipcRenderer.on('log:renderer', callback),
  addNotification: (callback) => ipcRenderer.on('notify', callback),

  addImageToModel: (callback) => ipcRenderer.on('addToModel:images', callback),

  // RENDERER -> MAIN
  // Logger
  logToMain: (text) => ipcRenderer.send('log:main', text),

  // fs.ts
  getPath: () => ipcRenderer.invoke('getPath:main'),
  getSavesPath: () => ipcRenderer.invoke('getPath:saves'),
  readTextFile: (path) => ipcRenderer.invoke('readTextFile', path),
  writeTextFile: (path, rows) => ipcRenderer.invoke('writeTextFile', path, rows),
  writeTextFileInSaves: (path, rows) => ipcRenderer.invoke('writeTextFile:saves', path, rows),
  copyFile: (sourcePath, destinationPath) => ipcRenderer.invoke('copyFile', sourcePath, destinationPath),
  copyFileToSaves: (sourcePath, name) => ipcRenderer.invoke('copyFile:saves', sourcePath, name),
  removeFile: (filePath) => ipcRenderer.invoke('removeFile', filePath),
  removeFileInSaves: (name) => ipcRenderer.invoke('removeFile:saves', name),
  removeImage: (name) => ipcRenderer.invoke('removeFile:images', name),

  // cvs.ts
  convertDataToCSV: (data) => ipcRenderer.invoke('convertToCSV', data),

  // filePicker.ts
  openFilePicker: () => ipcRenderer.invoke('filePicker:open'),
  saveFilePicker: () => ipcRenderer.invoke('filePicker:save'),

  // export.ts
  exportTPImageTable: (data, chooseLocation) => ipcRenderer.send('export:tp', data, chooseLocation),
  exportGCPImageTable: (data, chooseLocation) => ipcRenderer.send('export:gcp_img', data, chooseLocation),
  exportGCPObjectTable: (data, chooseLocation) => ipcRenderer.send('export:gcp_obj', data, chooseLocation),
  exportCameraPositionTable: (data, chooseLocation) => ipcRenderer.send('export:camera', data, chooseLocation),
  exportPointCloudTable: (data, chooseLocation) => ipcRenderer.send('export:cloud', data, chooseLocation),
  exportCameraSettingsTable: (data, chooseLocation) => ipcRenderer.send('export:settings', data, chooseLocation),
  exportImageListTable: (data, chooseLocation) => ipcRenderer.send('export:img_list', data, chooseLocation),

  // import.ts
  importTPImageTable: (chooseLocation) => ipcRenderer.invoke('import:tp', chooseLocation),
  importGCPImageTable: (chooseLocation) => ipcRenderer.invoke('import:gcp_img', chooseLocation),
  importGCPObjectTable: (chooseLocation) => ipcRenderer.invoke('import:gcp_obj', chooseLocation),
  importCameraPositionTable: (chooseLocation) => ipcRenderer.invoke('import:camera', chooseLocation),
  importPointCloudTable: (chooseLocation) => ipcRenderer.invoke('import:cloud', chooseLocation),
  importCameraSettingsTable: (chooseLocation) => ipcRenderer.invoke('import:settings', chooseLocation),
  importImageListTable: (chooseLocation) => ipcRenderer.invoke('import:img_list', chooseLocation),

  // images.ts
  importImage: (existingImages, imageId) => ipcRenderer.send('import:image', existingImages, imageId),

  // computeResults.ts
  computeResults: () => ipcRenderer.invoke('computeResults:run', {})
});
