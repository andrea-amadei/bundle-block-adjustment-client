const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // MAIN -> RENDER
  logToRenderer: (callback) => ipcRenderer.on('log:renderer', callback),
  addNotification: (callback) => ipcRenderer.on('notify', callback),

  addCameraPositionsToModel: (callback) => ipcRenderer.on('addToModel:camera', callback),

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

  // import.ts
  importCameraPositionTable: (chooseLocation) => ipcRenderer.send('import:camera', chooseLocation),
});
