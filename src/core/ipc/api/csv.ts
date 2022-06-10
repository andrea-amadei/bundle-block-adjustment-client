import { stringify } from 'csv-stringify';
import { parse } from 'csv-parse';

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

export function convertCSVToData(csv: string): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const result: string[][] = [];

    const parser = parse({
      delimiter: ';',
    });

    parser.on('readable', () => {
      let record;
      while ((record = parser.read()) !== null) {
        result.push(record);
      }
    });

    parser.on('error', (error) => {
      reject(error);
    });

    parser.on('finish', () => {
      resolve(result);
    });

    csv.split('\n').forEach((row) => parser.write(row));
    parser.end();
  });
}

export interface ConstraintType {
  type: 'string' | 'int' | 'float' | 'boolean';
  validator: (value: string | number | boolean) => boolean;
}

export function validateRow(row: string[], constraints: (ConstraintType | null)[]): boolean {
  if (row.length !== constraints.length)
    return false;

  for (let i = 0; i < row.length; i += 1) {
    if (row[i].length === 0)
      return false;

    if (constraints[i] !== null) {
      // Check type
      if (constraints[i]?.type === 'float') {
        if (Number.isNaN(parseFloat(row[i]))) return false;
      } else if (constraints[i]?.type === 'float') {
        if (Number.isNaN(parseInt(row[i], 10))) return false;
      } else if (constraints[i]?.type === 'boolean') {
        if (row[i].toLowerCase() !== 'true' && row[i].toLowerCase() !== 'false')
          return false;
      }

      // Check validator
      if (constraints[i]?.validator !== null) {
        if (!constraints[i]?.validator(row[i]))
          return false;
      }
    }
  }

  return true;
}
