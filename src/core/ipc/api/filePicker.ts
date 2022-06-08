import OpenDialogOptions = Electron.OpenDialogOptions;
import SaveDialogOptions = Electron.SaveDialogOptions;

const { dialog } = require('electron');

export async function openFilePicker(options: OpenDialogOptions): Promise<string[]> {
  const { canceled, filePaths } = await dialog.showOpenDialog(options);
  if (canceled) throw Error('cancelled');

  return filePaths;
}

export async function saveFilePicker(options: SaveDialogOptions): Promise<string> {
  const { canceled, filePath } = await dialog.showSaveDialog(options);
  if (canceled || filePath === undefined) throw Error('cancelled');

  return filePath;
}
