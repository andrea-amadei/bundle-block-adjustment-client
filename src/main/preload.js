const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // MAIN -> RENDER
  logToRenderer: (callback) => ipcRenderer.on('log:renderer', callback),

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
  exportTPImageTable: (data) => ipcRenderer.send('export:tp', data),
  exportGCPImageTable: (data) => ipcRenderer.send('export:gcp_img', data),
  exportGCPObjectTable: (data) => ipcRenderer.send('export:gcp_obj', data),
  exportCameraPositionTable: (data) => ipcRenderer.send('export:camera', data),
  exportPointCloudTable: (data) => ipcRenderer.send('export:cloud', data),
  exportCameraSettingsTable: (data) => ipcRenderer.send('export:settings', data),
});
