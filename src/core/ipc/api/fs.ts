import path from 'path';
import { app } from 'electron';
import fs from 'fs';

export function getPath() {
  return path.join(app.getPath('userData'));
}

export function getSavesPath() {
  return path.join(app.getPath('userData'), 'saves');
}

export async function createSavesDirectory(): Promise<void> {
  return new Promise((resolve) => {
    const lastDirectory = path.join(getSavesPath(), 'images');

    if (!fs.existsSync(lastDirectory)) {
      fs.mkdirSync(lastDirectory, { recursive: true });
    }

    resolve();
  });
}

export async function readTextFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });
}

export async function writeTextFile(filePath: string, rows: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      filePath,
      rows.map((x) => x.replace(/\n$/, '')).join('\n'),
      (error) => {
        if (error) reject(error);
        else resolve();
      }
    );
  });
}

export async function writeTextFileInSaves(filePath: string, rows: string[]): Promise<void> {
  return writeTextFile(path.join(getSavesPath(), filePath), rows);
}

export async function copyFile(sourcePath: string, destinationPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.copyFile(sourcePath, destinationPath, (error) => {
      if (error) reject();

      resolve();
    });
  });
}

export async function copyFileToSaves(sourcePath: string, name: string) {
  await copyFile(sourcePath, path.join(getSavesPath(), name));
}
