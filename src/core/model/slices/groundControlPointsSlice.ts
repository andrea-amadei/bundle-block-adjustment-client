import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PointOnImage } from '../interfaces/pointOnImageInterface';
import type { RootState } from '../store';

export type PointOnImageGCP = { source: 'MANUAL' | 'IMPORTED' } & PointOnImage;

export interface GroundControlPoint {
  pointId: number;
  linkedImages: PointOnImageGCP[];
  x: number;
  y: number;
  z: number;
}

export const groundControlPointsSlice = createSlice({
  name: 'groundControlPoints',

  // TODO: perhaps it is better to convert the state to a map?
  initialState: [] as GroundControlPoint[],

  reducers: {
    addPoint: (state: GroundControlPoint[], action: PayloadAction<GroundControlPoint>) => {
      if (state.map((x) => x.pointId).includes(action.payload.pointId))
        throw Error('Point ID must be unique');

      state.push(action.payload);
    },

    removePointByPointId: (state: GroundControlPoint[], action: PayloadAction<number>) => {
      state.splice(
        state.findIndex((x) => x.pointId === action.payload),
        1
      );
    },

    setXByPointId: {
      prepare: (id: number, x: number) => ({ payload: { id, x } }),

      reducer: (state: GroundControlPoint[], action: PayloadAction<{ id: number; x: number }>) => {
        try {
          state.filter((p) => p.pointId === action.payload.id)[0].x =
            action.payload.x;
        } catch (e) {
          throw Error('No existing point with given ID');
        }
      },
    },

    setYByPointId: {
      prepare: (id: number, y: number) => ({ payload: { id, y } }),

      reducer: (state: GroundControlPoint[], action: PayloadAction<{ id: number; y: number }>) => {
        try {
          state.filter((p) => p.pointId === action.payload.id)[0].y =
            action.payload.y;
        } catch (e) {
          throw Error('No existing point with given ID');
        }
      },
    },

    setZByPointId: {
      prepare: (id: number, z: number) => ({ payload: { id, z } }),

      reducer: (state: GroundControlPoint[], action: PayloadAction<{ id: number; z: number }>) => {
        try {
          state.filter((p) => p.pointId === action.payload.id)[0].z =
            action.payload.z;
        } catch (e) {
          throw Error('No existing point with given ID');
        }
      },
    },

    addLinkedImageByPointId: {
      prepare: (id: number, image: PointOnImageGCP) => ({
        payload: { id, image },
      }),

      reducer: (state: GroundControlPoint[], action: PayloadAction<{ id: number, image: PointOnImageGCP }>) => {
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
      },
    },

    removeLinkedImageByPointId: {
      prepare: (pointId: number, imageId: number) => ({
        payload: { pointId, imageId },
      }),

      reducer: (state: GroundControlPoint[], action: PayloadAction<{ pointId: number, imageId: number }>) => {
        if (!state.map((x) => x.pointId).includes(action.payload.pointId))
          throw Error('No existing point with given ID');

        const images = state.filter(
          (p) => p.pointId === action.payload.pointId
        )[0].linkedImages;

        images.splice(
          images.findIndex((p) => p.imageId === action.payload.imageId),
          1
        );
      },
    },
  },
});

export const {
  addPoint,
  removePointByPointId,
  setXByPointId,
  setYByPointId,
  setZByPointId,
  addLinkedImageByPointId,
  removeLinkedImageByPointId,
} = groundControlPointsSlice.actions;

export const selectGroundControlPointById =
  (id: number) => (state: RootState) =>
    state.groundControlPoints[id];

export const selectGroundControlPointsOnImage =
  (imageId: number) => (state: RootState) =>
    state.groundControlPoints.filter((x) =>
      x.linkedImages.some((y) => y.imageId === imageId)
    );

export default groundControlPointsSlice.reducer;
