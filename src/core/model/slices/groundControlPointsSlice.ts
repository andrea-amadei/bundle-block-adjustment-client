import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PointOnImage, CommonPoint } from './common/interfaces';
import type { RootState } from '../store';
import {
  addLinkedImageByPointIdCommon,
  addPointCommon,
  removeLinkedImageByPointIdCommon,
  removePointByPointIdCommon,
} from './common/reducers';

export type PointOnImageGCP = { source: 'MANUAL' | 'IMPORTED' } & PointOnImage;

export interface GroundControlPoint extends CommonPoint<PointOnImageGCP> {
  x: number;
  y: number;
  z: number;
}

export const groundControlPointsSlice = createSlice({
  name: 'groundControlPoints',

  // TODO: perhaps it is better to convert the state to a map?
  initialState: [] as GroundControlPoint[],
  reducers: {
    addPoint: (
      state: GroundControlPoint[],
      action: PayloadAction<GroundControlPoint>
    ) => addPointCommon(state, action),

    removePointByPointId: (
      state: GroundControlPoint[],
      action: PayloadAction<number>
    ) => removePointByPointIdCommon(state, action),

    addLinkedImageByPointId: {
      prepare: (id: number, image: PointOnImageGCP) => ({
        payload: { id, image },
      }),

      reducer: (
        state: GroundControlPoint[],
        action: PayloadAction<{ id: number; image: PointOnImageGCP }>
      ) => addLinkedImageByPointIdCommon(state, action),
    },

    removeLinkedImageByPointId: {
      prepare: (pointId: number, imageId: number) => ({
        payload: { pointId, imageId },
      }),

      reducer: (state: GroundControlPoint[], action: PayloadAction<{ pointId: number, imageId: number }>) =>
        removeLinkedImageByPointIdCommon(state, action),
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
