import * as child_process from 'child_process';
import path from 'path';
import { mkdir } from 'fs';
import { getComputeResultsJarPath, makeDir } from './fs';
import { TiePoint } from '../../model/slices/tiePointsSlice';
import { GroundControlPoint } from '../../model/slices/groundControlPointsSlice';
import { InputImageToIdMap } from '../../model/slices/imageListSlice';
import { CameraPosition } from '../../model/slices/common/interfaces';
import { CameraState } from '../../model/slices/cameraSlice';
import { ComputationParamsMap } from '../../../ui/components/common/OptionParams';
import {
  exportCameraSettingsTableForComputation,
  exportGCPImageTableForComputation,
  exportGCPObjectTableForComputation,
  exportImagesForComputation,
  exportTPImageTableForComputation,
} from './exportForComputation';
import {
  stringifyCmdParams,
  templateComputationParams,
  templateInputComputationParams,
} from '../../model/ComputationParams';
import { getMainWindow } from '../../../main/main';
import { Message } from "../../model/slices/messages/messageQueueSlice";

export interface ComputeResultsInputData {
  tp: TiePoint[];
  gcp: GroundControlPoint[];
  images: InputImageToIdMap;
  imgPosition: { [imgId: number]: CameraPosition };
  cameraSettings: CameraState;
}

export async function computeResults(
  dirPath: string,
  inputData: ComputeResultsInputData,
  cmdArgs: ComputationParamsMap
) {
  const jarPath = getComputeResultsJarPath();

  const inputDirPath = path.join(dirPath, 'input');
  const outputDirPath = path.join(dirPath, 'output');

  await makeDir(inputDirPath);
  await makeDir(outputDirPath);

  if(Object.values(inputData.images).length === 0) {
    getMainWindow()?.webContents.send('notify', {
      message: 'There are no images in project',
      status: 'error'
    } as Message);
    throw Error('There are no images in project');
  }

  const width = Object.values(inputData.images)[0].width;
  const height = Object.values(inputData.images)[0].height;

  if(Object.values(inputData.images).some(img => img.width !== width || img.height !== height) ) {
    getMainWindow()?.webContents.send('notify', {
      message: 'Images must all have the same size!',
      status: 'error'
    } as Message);
    throw Error('Images must all have the same size!');
  }

  const [pathTpImg, pathGcpImg, pathGcpObj, pathImages, pathCameraSettings] =
    await Promise.all([
      exportTPImageTableForComputation(inputDirPath, inputData.tp),
      exportGCPImageTableForComputation(inputDirPath, inputData.gcp),
      exportGCPObjectTableForComputation(inputDirPath, inputData.gcp),
      exportImagesForComputation(inputDirPath, {
        images: inputData.images,
        imgPosition: inputData.imgPosition,
      }),
      exportCameraSettingsTableForComputation(
        inputDirPath,
        inputData.cameraSettings,
        width,
        height
      ),
    ]);

  const inputFileArgsStr = stringifyCmdParams(
    {
      gcpS: pathGcpObj as string,
      gcpI: pathGcpImg as string,
      tpI: pathTpImg as string,
      imgs: pathImages as string,
      cams: pathCameraSettings as string,
    },
    templateInputComputationParams
  );

  const cmdArgsStr = stringifyCmdParams(
    { ...cmdArgs, out: outputDirPath },
    templateComputationParams
  );

  console.log("args", inputFileArgsStr, cmdArgsStr);

  const child = child_process.spawn('java', [
    '-jar',
    jarPath,
    ...inputFileArgsStr,
    ...cmdArgsStr,
  ]);

  /*  var kill = require(‘tree-kill’);
  kill(child.pid); */

  child.stdout.setEncoding('utf8');
  child.stdout.on('data', function (data) {
    console.log(`stdout: ${data}`);
    getMainWindow()?.webContents.send('computeResults:log', data.toString());
  });

  child.stderr.setEncoding('utf8');
  child.stderr.on('data', function (data) {
    console.log(`stderr: ${data}`);
    getMainWindow()?.webContents.send('computeResults:log', data.toString());
  });

  child.on('close', function (code) {
    // Here you can get the exit code of the script

    console.log(`closing code: ${code}`);

  });

  return 'test1';
}
