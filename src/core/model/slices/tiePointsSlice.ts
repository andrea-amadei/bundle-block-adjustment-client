import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PointOnImage, VirtualPoint } from './common/interfaces';
import type { RootState } from '../store';
import {
  addLinkedPointCommon,
  addPointCommon,
  removeLinkedPointCommon,
  removePointCommon,
  setLinkedPointXCommon,
  setLinkedPointYCommon,
} from './common/reducers';

export type TiePoint = VirtualPoint<PointOnImage>;

export const tiePointsSlice = createSlice({
  name: 'tiePoints',

  // TODO: perhaps it is better to convert the state to a map?
  initialState: [] as TiePoint[],

  reducers: {
    addPoint: (state: TiePoint[], action: PayloadAction<TiePoint>) =>
      addPointCommon(state, action),

    removePointByPointId: (state: TiePoint[], action: PayloadAction<number>) =>
      removePointCommon(state, action),

    addLinkedPointByPointId: {
      prepare: (id: number, image: PointOnImage) => ({
        payload: { id, image },
      }),

      reducer: (
        state: TiePoint[],
        action: PayloadAction<{ id: number; image: PointOnImage }>
      ) => addLinkedPointCommon(state, action),
    },

    removeLinkedPointByPointId: {
      prepare: (pointId: number, imageId: number) => ({
        payload: { pointId, imageId },
      }),

      reducer: (
        state: TiePoint[],
        action: PayloadAction<{ pointId: number; imageId: number }>
      ) => removeLinkedPointCommon(state, action),
    },

    setLinkedPointX: {
      prepare: (pointId: number, imageId: number, x: number) => ({
        payload: { pointId, imageId, x },
      }),

      reducer: (
        state: TiePoint[],
        action: PayloadAction<{ pointId: number; imageId: number; x: number }>
      ) => setLinkedPointXCommon(state, action),
    },

    setLinkedPointY: {
      prepare: (pointId: number, imageId: number, y: number) => ({
        payload: { pointId, imageId, y },
      }),

      reducer: (
        state: TiePoint[],
        action: PayloadAction<{ pointId: number; imageId: number; y: number }>
      ) => setLinkedPointYCommon(state, action),
    },
  },
});

export const {
  addPoint,
  removePointByPointId,
  addLinkedPointByPointId,
  removeLinkedPointByPointId,
  setLinkedPointX,
  setLinkedPointY,
} = tiePointsSlice.actions;

export const selectTiePointById = (id: number) => (state: RootState) =>
  state.groundControlPoints[id];

export const selectTiePointsOnImage = (imageId: number) => (state: RootState) =>
  state.groundControlPoints.filter((x) =>
    x.linkedPoints.some((y) => y.imageId === imageId)
  );

export default tiePointsSlice.reducer;
