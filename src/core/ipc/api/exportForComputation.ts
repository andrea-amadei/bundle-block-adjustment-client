import path from 'path';
import { TiePoint } from '../../model/slices/tiePointsSlice';
import { saveFilePicker } from './filePicker';
import { convertDataToCSV } from './csv';
import { getSavesPath, writeTextFile } from './fs';
import { getMainWindow } from '../../../main/main';
import {
  CameraPosition,
  RealPoint,
} from '../../model/slices/common/interfaces';
import { GroundControlPoint } from '../../model/slices/groundControlPointsSlice';
import { Message } from '../../model/slices/messages/messageQueueSlice';
import { InputImage } from '../../model/slices/imageListSlice';
import { app } from "electron";
import { exportToCSV, exportToCSVAtPath } from "./export";
import { CameraState } from "../../model/slices/cameraSlice";

export async function exportToCSVWithHeader(path: string, header: string[], data: any[][]) {
  return exportToCSVAtPath(path, [header, ...data], false);
}

export function exportTPImageTableForComputation(dirPath: string, data: TiePoint[]) {
  return exportToCSVWithHeader(
    path.join(dirPath, 'tpImage.csv'),
    ['id_tie', 'id_img', 'x', 'y', 'source'],
    data.flatMap((tp) =>
      Object.entries(tp.linkedImages).map(([, p]) => [
        p.pointId,
        p.imageId,
        p.x,
        p.y,
        p.source,
      ])
    )
  );
}

export function exportGCPImageTableForComputation(dirPath: string, data: GroundControlPoint[]) {
  return exportToCSVWithHeader(
    path.join(dirPath, 'gcpImage.csv'),
    ['id_gcp', 'id_img', 'x', 'y', 'source'],
    data.flatMap((gcp) =>
      Object.entries(gcp.linkedImages).map(([, p]) => [
        p.pointId,
        p.imageId,
        p.x,
        p.y,
        p.source,
      ])
    )
  );
}

export function exportGCPObjectTableForComputation(dirPath: string, data: GroundControlPoint[]) {
  return exportToCSVWithHeader(
    path.join(dirPath, 'gcpSpace.csv'),
    ['id_gcp', 'x', 'y', 'z'],
    data.map((gcp) => [gcp.pointId, gcp.x, gcp.y, gcp.z])
  );
}

export function exportImagesForComputation(dirPath: string, data: {imgPosition: {[imgId: number]: CameraPosition}, images: {[imgId: number]: InputImage}}) {
  return exportToCSVWithHeader(
    path.join(dirPath, 'images.csv'),
    ['id_img', 'filename', 'id_cam', 'X0', 'Y0', 'Z0', 'alpha', 'beta', 'gamma'],
    Object.keys(data.images)
      .map(idStr => parseInt(idStr, 10))
      .map(imgId => [
        imgId,
        data.images[imgId].path.match("file:///") ? data.images[imgId].path.split("file:///")[1] : data.images[imgId].path,
        1,
        data.imgPosition[imgId].xc,
        data.imgPosition[imgId].yc,
        data.imgPosition[imgId].zc,
        data.imgPosition[imgId].omega,
        data.imgPosition[imgId].phi,
        data.imgPosition[imgId].kappa,
      ])
  );
}


export function exportCameraSettingsTableForComputation(dirPath: string, data: CameraState, width: number, height: number) {
  return exportToCSVWithHeader(
    path.join(dirPath, 'cameras.csv'),
    ['id_cam', 'xi0', 'eta0', 'c', 'width', 'height', 'pixel', 'k1', 'k2', 'k3', 'p1', 'p2' ,'a1', 'a2'],
    [[1, data.xi0, data.eta0, data.c, width, height, data.pixel, data.k1, data.k2, data.k3, data.p1, data.p2, data.a1, data.a2]]
  );
}





