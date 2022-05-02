import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
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
import { tpTest } from "./ModelTestData";

export type TiePoint = VirtualPoint<PointOnImage>;

export const tiePointsSlice = createSlice({
  name: 'tiePoints',

  // TODO: perhaps it is better to convert the state to a map?
  //initialState: [] as TiePoint[],
  initialState: tpTest as TiePoint[],

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

export const selectAllTiePoints = (state: RootState) =>
  state.tiePoints as TiePoint[];

export const selectTiePointById = (id: number) => (state: RootState) =>
  state.tiePoints[id] as TiePoint;

const _selectImageId = (_state: RootState, {imageId}: {imageId: number | undefined}) => imageId;
const _selectTiePointsOnImage = createSelector(
  [selectAllTiePoints, _selectImageId],
  (points, imageId) => points
    .flatMap(point => point.linkedPoints)
    .filter(pointOnImage => pointOnImage.imageId === imageId)
);
export const selectTiePointsOnImage = (imageId: number | undefined) => (state: RootState) =>
  _selectTiePointsOnImage(state, {imageId}) as PointOnImage[];

const _selectPointSourceType = (_state: RootState, {pointSourceType}: {pointSourceType: string | undefined}) => pointSourceType;
const _selectTiePointsOnImageBySourceType = createSelector(
  [_selectTiePointsOnImage, _selectPointSourceType],
  (tpOnImageList, source) => tpOnImageList
    .filter(tp => tp.source === source)
);
export const selectTiePointsOnImageBySourceType = (imageId: number | undefined, pointSourceType: string | undefined) => (state: RootState) =>
  _selectTiePointsOnImageBySourceType(state, {imageId, pointSourceType}) as PointOnImage[];

/*
export const selectTiePointsOnImage = (imageId: number | undefined) => (state: RootState) =>
   state.tiePoints.filter((x) =>
    x.linkedPoints.some((y) => y.imageId === imageId)
  ) as TiePoint[];
   */

export default tiePointsSlice.reducer;
