import { PayloadAction } from '@reduxjs/toolkit';
import {
  VirtualPoint,
  PointOnImage,
  Point,
  RealPoint,
  CameraPosition,
} from './interfaces';

export function addPointCommon<T extends Point>(
  state: T[],
  action: PayloadAction<T>
) {
  if (state.map((x) => x.pointId).includes(action.payload.pointId))
    throw Error('Point ID must be unique');

  state.push(action.payload);
}

export function removePointCommon<T extends Point>(
  state: T[],
  action: PayloadAction<number>
) {
  state.splice(
    state.findIndex((x) => x.pointId === action.payload),
    1
  );
}

export function addLinkedPointCommon<
  T extends VirtualPoint<P>,
  P extends PointOnImage
>(state: T[], action: PayloadAction<{ id: number; image: P }>) {
  if (!state.map((x) => x.pointId).includes(action.payload.id))
    throw Error('No existing point with given ID');

  if (action.payload.id !== action.payload.image.pointId)
    throw Error("Point ID and image's point ID must be identical");

  const point = state.filter((p) => p.pointId === action.payload.id)[0];

  if (
    point.linkedPoints
      .map((x) => x.imageId)
      .includes(action.payload.image.imageId)
  )
    throw Error('Image ID must be unique');

  point.linkedPoints.push(action.payload.image);
}

export function removeLinkedPointCommon<
  T extends VirtualPoint<P>,
  P extends PointOnImage
>(state: T[], action: PayloadAction<{ pointId: number; imageId: number }>) {
  if (!state.map((x) => x.pointId).includes(action.payload.pointId))
    throw Error('No existing point with given ID');

  const images = state.filter((p) => p.pointId === action.payload.pointId)[0]
    .linkedPoints;

  images.splice(
    images.findIndex((p) => p.imageId === action.payload.imageId),
    1
  );
}

export function setLinkedPointXCommon<
  T extends VirtualPoint<P>,
  P extends PointOnImage
>(
  state: T[],
  action: PayloadAction<{ pointId: number; imageId: number; x: number }>
) {
  if (!state.map((x) => x.pointId).includes(action.payload.pointId))
    throw Error('No existing point with given ID');

  const images = state.filter((p) => p.pointId === action.payload.pointId)[0]
    .linkedPoints;

  if (!images.map((x) => x.imageId).includes(action.payload.imageId))
    throw Error('No existing image with given ID');

  images.filter((i) => i.imageId === action.payload.imageId)[0].x =
    action.payload.x;
}

export function setLinkedPointYCommon<
  T extends VirtualPoint<P>,
  P extends PointOnImage
>(
  state: T[],
  action: PayloadAction<{ pointId: number; imageId: number; y: number }>
) {
  if (!state.map((x) => x.pointId).includes(action.payload.pointId))
    throw Error('No existing point with given ID');

  const images = state.filter((p) => p.pointId === action.payload.pointId)[0]
    .linkedPoints;

  if (!images.map((x) => x.imageId).includes(action.payload.imageId))
    throw Error('No existing image with given ID');

  images.filter((i) => i.imageId === action.payload.imageId)[0].y =
    action.payload.y;
}

export function setXByPointIdCommon<T extends RealPoint>(
  state: T[],
  action: PayloadAction<{ pointId: number; x: number }>
) {
  try {
    state.filter((p) => p.pointId === action.payload.pointId)[0].x =
      action.payload.x;
  } catch (e) {
    throw Error('No existing point with given ID');
  }
}

export function setYByPointIdCommon<T extends RealPoint>(
  state: T[],
  action: PayloadAction<{ pointId: number; y: number }>
) {
  try {
    state.filter((p) => p.pointId === action.payload.pointId)[0].y =
      action.payload.y;
  } catch (e) {
    throw Error('No existing point with given ID');
  }
}

export function setZByPointIdCommon<T extends RealPoint>(
  state: T[],
  action: PayloadAction<{ pointId: number; z: number }>
) {
  try {
    state.filter((p) => p.pointId === action.payload.pointId)[0].z =
      action.payload.z;
  } catch (e) {
    throw Error('No existing point with given ID');
  }
}

export function addCameraPositionCommon(
  state: CameraPosition[],
  action: PayloadAction<CameraPosition>
) {
  if (state.map((x) => x.imageId).includes(action.payload.imageId))
    throw Error('Image ID must be unique');

  state.push(action.payload);
}

export function removeCameraPositionCommon(
  state: CameraPosition[],
  action: PayloadAction<number>
) {
  state.splice(
    state.findIndex((x) => x.imageId === action.payload),
    1
  );
}
