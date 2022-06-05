import { stringify } from 'csv-stringify';

export function convertDataToCSV(data: string[][]): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const result: string[] = [];

    const stringifier = stringify({
      delimiter: ':',
    });

    stringifier.on('readable', () => {
      let row;
      while ((row = stringifier.read()) !== null) {
        result.push(row);
      }
    });

    stringifier.on('error', (error) => {
      reject(error);
    });

    stringifier.on('finish', () => {
      resolve(result);
    });

    data.forEach((row) => stringifier.write(row));
    stringifier.end();
  });
}
