import { stringify } from 'csv-stringify';

export function convertDataToCSV(data: any[][]): Promise<string> {
  return new Promise((resolve, reject) => {
    const result: string[] = [];

    const stringifier = stringify({
      delimiter: ';',
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
      resolve(result.join(''));
    });

    data.forEach((row) =>
      stringifier.write(row.filter((value) => value.toString()))
    );
    stringifier.end();
  });
}
