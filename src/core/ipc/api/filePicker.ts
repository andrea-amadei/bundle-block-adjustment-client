import OpenDialogOptions = Electron.OpenDialogOptions;

const { dialog } = require('electron');

export async function openFilePicker(options: OpenDialogOptions) {
  const { canceled, filePaths } = await dialog.showOpenDialog(options);
  if (canceled) throw Error('cancelled');

  return filePaths;
}
