import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PointOnImage, CommonPoint } from './common/interfaces';
import type { RootState } from '../store';
import {
  addLinkedImageCommon,
  addPointCommon,
  removeLinkedImageCommon,
  removePointCommon,
  setLinkedImageXCommon,
  setLinkedImageYCommon,
} from './common/reducers';

export type TiePoint = CommonPoint<PointOnImage>;

export const tiePointsSlice = createSlice({
  name: 'tiePoints',

  // TODO: perhaps it is better to convert the state to a map?
  initialState: [] as TiePoint[],

  reducers: {
    addPoint: (state: TiePoint[], action: PayloadAction<TiePoint>) =>
      addPointCommon(state, action),

    removePointByPointId: (state: TiePoint[], action: PayloadAction<number>) =>
      removePointCommon(state, action),

    addLinkedImageByPointId: {
      prepare: (id: number, image: PointOnImage) => ({
        payload: { id, image },
      }),

      reducer: (
        state: TiePoint[],
        action: PayloadAction<{ id: number; image: PointOnImage }>
      ) => addLinkedImageCommon(state, action),
    },

    removeLinkedImageByPointId: {
      prepare: (pointId: number, imageId: number) => ({
        payload: { pointId, imageId },
      }),

      reducer: (
        state: TiePoint[],
        action: PayloadAction<{ pointId: number; imageId: number }>
      ) => removeLinkedImageCommon(state, action),
    },

    setLinkedImageX: {
      prepare: (pointId: number, imageId: number, x: number) => ({
        payload: { pointId, imageId, x },
      }),

      reducer: (
        state: TiePoint[],
        action: PayloadAction<{ pointId: number; imageId: number; x: number }>
      ) => setLinkedImageXCommon(state, action),
    },

    setLinkedImageY: {
      prepare: (pointId: number, imageId: number, y: number) => ({
        payload: { pointId, imageId, y },
      }),

      reducer: (
        state: TiePoint[],
        action: PayloadAction<{ pointId: number; imageId: number; y: number }>
      ) => setLinkedImageYCommon(state, action),
    },
  },
});

export const {
  addPoint,
  removePointByPointId,
  addLinkedImageByPointId,
  removeLinkedImageByPointId,
  setLinkedImageX,
  setLinkedImageY,
} = tiePointsSlice.actions;

export const selectTiePointById = (id: number) => (state: RootState) =>
  state.groundControlPoints[id];

export const selectTiePointsOnImage = (imageId: number) => (state: RootState) =>
  state.groundControlPoints.filter((x) =>
    x.linkedImages.some((y) => y.imageId === imageId)
  );

export default tiePointsSlice.reducer;
