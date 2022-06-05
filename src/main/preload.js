const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  log: (text) => ipcRenderer.send('log', text),

  getPath: () => ipcRenderer.invoke('getPath:main'),
  getSavesPath: () => ipcRenderer.invoke('getPath:saves'),
  readTextFile: (path) => ipcRenderer.invoke('readTextFile', path),
  writeTextFile: (path, rows) => ipcRenderer.invoke('writeTextFile', path, rows),
  writeTextFileInSaves: (path, rows) => ipcRenderer.invoke('writeTextFile:saves', path, rows),
  copyFile: (sourcePath, destinationPath) => ipcRenderer.invoke('copyFile', sourcePath, destinationPath),
  copyFileToSaves: (sourcePath, name) => ipcRenderer.invoke('copyFile:saves', sourcePath, name),

  openFilePicker: () => ipcRenderer.invoke('filePicker:open'),
});
