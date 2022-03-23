import { PayloadAction } from '@reduxjs/toolkit';
import { CommonPoint, PointOnImage } from './interfaces';

export function addPointCommon<
  T extends CommonPoint<P>,
  P extends PointOnImage
>(state: T[], action: PayloadAction<T>) {
  if (state.map((x) => x.pointId).includes(action.payload.pointId))
    throw Error('Point ID must be unique');

  state.push(action.payload);
}

export function removePointCommon<
  T extends CommonPoint<P>,
  P extends PointOnImage
>(state: T[], action: PayloadAction<number>) {
  state.splice(
    state.findIndex((x) => x.pointId === action.payload),
    1
  );
}

export function addLinkedImageCommon<
  T extends CommonPoint<P>,
  P extends PointOnImage
>(state: T[], action: PayloadAction<{ id: number; image: P }>) {
  if (!state.map((x) => x.pointId).includes(action.payload.id))
    throw Error('No existing point with given ID');

  if (action.payload.id !== action.payload.image.pointId)
    throw Error("Point ID and image's point ID must be identical");

  const point = state.filter((p) => p.pointId === action.payload.id)[0];

  if (
    point.linkedImages
      .map((x) => x.imageId)
      .includes(action.payload.image.imageId)
  )
    throw Error('Image ID must be unique');

  point.linkedImages.push(action.payload.image);
}

export function removeLinkedImageCommon<
  T extends CommonPoint<P>,
  P extends PointOnImage
>(state: T[], action: PayloadAction<{ pointId: number; imageId: number }>) {
  if (!state.map((x) => x.pointId).includes(action.payload.pointId))
    throw Error('No existing point with given ID');

  const images = state.filter((p) => p.pointId === action.payload.pointId)[0]
    .linkedImages;

  images.splice(
    images.findIndex((p) => p.imageId === action.payload.imageId),
    1
  );
}

export function setLinkedImageXCommon<
  T extends CommonPoint<P>,
  P extends PointOnImage
>(state: T[], action: PayloadAction<{ pointId: number; imageId: number; x: number }>) {
  if (!state.map((x) => x.pointId).includes(action.payload.pointId))
    throw Error('No existing point with given ID');

  const images = state.filter((p) => p.pointId === action.payload.pointId)[0]
    .linkedImages;

  if (!images.map((x) => x.imageId).includes(action.payload.imageId))
    throw Error('No existing image with given ID');

  images.filter((i) => i.imageId === action.payload.imageId)[0].x =
    action.payload.x;
}

export function setLinkedImageYCommon<
  T extends CommonPoint<P>,
  P extends PointOnImage
>(state: T[], action: PayloadAction<{ pointId: number; imageId: number; y: number }>) {
  if (!state.map((x) => x.pointId).includes(action.payload.pointId))
    throw Error('No existing point with given ID');

  const images = state.filter((p) => p.pointId === action.payload.pointId)[0]
    .linkedImages;

  if (!images.map((x) => x.imageId).includes(action.payload.imageId))
    throw Error('No existing image with given ID');

  images.filter((i) => i.imageId === action.payload.imageId)[0].y =
    action.payload.y;
}
