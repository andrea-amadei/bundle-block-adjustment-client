import path from 'path';
import { app } from 'electron';
import fs from 'fs';

export function getPath() {
  return path.join(app.getPath('userData'));
}

export function getSavesPath() {
  return path.join(app.getPath('userData'), 'saves');
}

export async function createSavesDirectory() {
  if (!fs.existsSync(getSavesPath())) {
    fs.mkdirSync(getSavesPath(), { recursive: true });
  }
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

export async function copyFile(sourcePath: string, destinationPath: string) {
  createSavesDirectory()
    .then(() =>
      fs.copyFile(sourcePath, destinationPath, (error) => {
        if (error) throw error;
      })
    )
    .catch((error) => {
      throw error;
    });
}

export async function copyFileToSaves(sourcePath: string, name: string) {
  await copyFile(sourcePath, path.join(getSavesPath(), name));
}
