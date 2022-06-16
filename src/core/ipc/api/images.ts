import path from 'path';
import { openFilePicker } from './filePicker';
import { copyFile, getSavesPath} from './fs';
import { getMainWindow } from '../../../main/main';
import { Message } from '../../model/slices/messages/messageQueueSlice';
import { InputImage } from '../../model/slices/imageListSlice';

const sizeOf = require('image-size');

export const supportedFiles = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'tif',
  'tiff',
  'bmp',
];

// If existingImages is empty open file picker
export function importImage(existingImages: InputImage[], startingId: number) {
  const defaultImages = existingImages.length !== 0;

  (!defaultImages
    ? openFilePicker({
        title: 'Open file',
        filters: [
          { name: 'Image', extensions: supportedFiles },
          { name: 'All Files', extensions: ['*'] },
        ],
        properties: ['openFile', 'multiSelections'],
      })
    : new Promise<string[]>((resolve) =>
        resolve(existingImages.map((x) => path.join(getSavesPath(), 'images', x.path)))
      )
  )
    .then((selectedPaths) => {
      if (selectedPaths.length === 0) {
        getMainWindow()?.webContents.send('notify', {
          message:
            "Must open at least one file... (THIS SHOULDN'T BE POSSIBLE!!!)",
          status: 'warning',
          symbol: 'add_a_photo',
        } as Message);
      } else {
        selectedPaths.forEach((imagePath, index) => {
          const extension = path.extname(imagePath);
          let newId: number;
          let newFileName: string;
          let newImageName: string;
          let newPath: string;

          if (!defaultImages) {
            newId = startingId + index;
            newFileName = `img_${String(newId).padStart(4, '0')}${extension}`;
            newPath = path.join(getSavesPath(), 'images', newFileName);
            newImageName = `Image ${newId}`;
          } else {
            newId = existingImages[index].id;
            newFileName = path.basename(existingImages[index].path);
            newPath = path.join(getSavesPath(), 'images', newFileName);
            newImageName = existingImages[index].name;
          }

          copyFile(imagePath, newPath)
            .then(() => {
              const dimensions = sizeOf(newPath);

              getMainWindow()?.webContents.send('addToModel:images', {
                id: newId,
                name: newImageName,
                path: `file:///${newPath}`,
                width: dimensions.width,
                height: dimensions.height,
              } as InputImage);
            })
            .catch(() => {
              getMainWindow()?.webContents.send('notify', {
                message: `Could not import image "${newImageName}"`,
                status: 'error',
                symbol: 'add_a_photo',
              } as Message);
            });
        });
      }
    })
    .catch(() => {
      getMainWindow()?.webContents.send('notify', {
        message: 'Action cancelled',
        status: 'warning',
        symbol: 'file_download',
      } as Message);
    });
}
