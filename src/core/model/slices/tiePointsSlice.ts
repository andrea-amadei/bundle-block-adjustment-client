import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PointOnImage, CommonPoint } from './common/interfaces';
import type { RootState } from '../store';
import {
  addLinkedImageByPointIdCommon,
  addPointCommon,
  removeLinkedImageByPointIdCommon,
  removePointByPointIdCommon,
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
      removePointByPointIdCommon(state, action),

    addLinkedImageByPointId: {
      prepare: (id: number, image: PointOnImage) => ({
        payload: { id, image },
      }),

      reducer: (
        state: TiePoint[],
        action: PayloadAction<{ id: number; image: PointOnImage }>
      ) => addLinkedImageByPointIdCommon(state, action),
    },

    removeLinkedImageByPointId: {
      prepare: (pointId: number, imageId: number) => ({
        payload: { pointId, imageId },
      }),

      reducer: (
        state: TiePoint[],
        action: PayloadAction<{ pointId: number; imageId: number }>
      ) => removeLinkedImageByPointIdCommon(state, action),
    },
  },
});

export const {
  addPoint,
  removePointByPointId,
  addLinkedImageByPointId,
  removeLinkedImageByPointId,
} = tiePointsSlice.actions;

export const selectTiePointById = (id: number) => (state: RootState) =>
  state.groundControlPoints[id];

export const selectTiePointsOnImage = (imageId: number) => (state: RootState) =>
  state.groundControlPoints.filter((x) =>
    x.linkedImages.some((y) => y.imageId === imageId)
  );

export default tiePointsSlice.reducer;
