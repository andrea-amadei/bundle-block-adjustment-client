import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PointOnImage, RealPoint, VirtualPoint } from './common/interfaces';
import type { RootState } from '../store';
import {
  addLinkedPointCommon,
  addPointCommon,
  removeLinkedPointCommon,
  removePointCommon,
  setLinkedPointXCommon,
  setLinkedPointYCommon,
  setXByPointIdCommon,
  setYByPointIdCommon,
  setZByPointIdCommon,
} from './common/reducers';
import { gcpTest } from './ModelTestData';

export type PointOnImageGCP = { source: 'MANUAL' | 'IMPORTED' } & PointOnImage;

export type GroundControlPoint = VirtualPoint<PointOnImageGCP> & RealPoint;

export const groundControlPointsSlice = createSlice({
  name: 'groundControlPoints',

  // TODO: perhaps it is better to convert the state to a map?
  // initialState: [] as GroundControlPoint[],
  initialState: gcpTest as GroundControlPoint[],

  reducers: {
    addPoint: (
      state: GroundControlPoint[],
      action: PayloadAction<GroundControlPoint>
    ) => addPointCommon(state, action),

    removePointByPointId: (
      state: GroundControlPoint[],
      action: PayloadAction<number>
    ) => removePointCommon(state, action),

    addLinkedPointByPointId: {
      prepare: (id: number, image: PointOnImageGCP) => ({
        payload: { id, image },
      }),

      reducer: (
        state: GroundControlPoint[],
        action: PayloadAction<{ id: number; image: PointOnImageGCP }>
      ) => addLinkedPointCommon(state, action),
    },

    removeLinkedPointByPointId: {
      prepare: (pointId: number, imageId: number) => ({
        payload: { pointId, imageId },
      }),

      reducer: (
        state: GroundControlPoint[],
        action: PayloadAction<{ pointId: number; imageId: number }>
      ) => removeLinkedPointCommon(state, action),
    },

    setLinkedPointX: {
      prepare: (pointId: number, imageId: number, x: number) => ({
        payload: { pointId, imageId, x },
      }),

      reducer: (
        state: GroundControlPoint[],
        action: PayloadAction<{ pointId: number; imageId: number; x: number }>
      ) => setLinkedPointXCommon(state, action),
    },

    setLinkedPointY: {
      prepare: (pointId: number, imageId: number, y: number) => ({
        payload: { pointId, imageId, y },
      }),

      reducer: (
        state: GroundControlPoint[],
        action: PayloadAction<{ pointId: number; imageId: number; y: number }>
      ) => setLinkedPointYCommon(state, action),
    },

    setXByPointId: {
      prepare: (pointId: number, x: number) => ({ payload: { pointId, x } }),

      reducer: (
        state: GroundControlPoint[],
        action: PayloadAction<{ pointId: number; x: number }>
      ) => setXByPointIdCommon(state, action),
    },

    setYByPointId: {
      prepare: (pointId: number, y: number) => ({ payload: { pointId, y } }),

      reducer: (
        state: GroundControlPoint[],
        action: PayloadAction<{ pointId: number; y: number }>
      ) => setYByPointIdCommon(state, action),
    },

    setZByPointId: {
      prepare: (pointId: number, z: number) => ({ payload: { pointId, z } }),

      reducer: (
        state: GroundControlPoint[],
        action: PayloadAction<{ pointId: number; z: number }>
      ) => setZByPointIdCommon(state, action),
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
  setXByPointId,
  setYByPointId,
  setZByPointId,
} = groundControlPointsSlice.actions;

export const selectAllGroundControlPoints = (state: RootState) =>
  state.groundControlPoints as GroundControlPoint[];

export const selectGroundControlPointById =
  (id: number) => (state: RootState) =>
    state.groundControlPoints[id] as GroundControlPoint;

const _selectImageId = (_state: RootState, {imageId}: {imageId: number | undefined}) => imageId;
const _selectGroundControlPointsOnImage = createSelector(
  [selectAllGroundControlPoints, _selectImageId],
  (points, imageId) =>
    points
      .flatMap((point) => point.linkedPoints)
      .filter((pointOnImage) => pointOnImage.imageId === imageId)
);
export const selectGroundControlPointsOnImage =
  (imageId: number | undefined) => (state: RootState) =>
    _selectGroundControlPointsOnImage(state, { imageId }) as PointOnImage[];

const _selectPointSourceType = (_state: RootState, {pointSourceType}: {pointSourceType: string | undefined}) => pointSourceType;
const _selectGroundControlPointsOnImageBySourceType = createSelector(
  [_selectGroundControlPointsOnImage, _selectPointSourceType],
  (tpOnImageList, source) => tpOnImageList.filter((tp) => tp.source === source)
);
export const selectGroundControlPointsOnImageBySourceType =
  (imageId: number | undefined, pointSourceType: string | undefined) =>
  (state: RootState) =>
    _selectGroundControlPointsOnImageBySourceType(state, { imageId, pointSourceType }) as PointOnImage[];

// export const selectAllGroundControlPoints = (state: RootState) =>
//   state.groundControlPoints;
//
// export const selectGroundControlPointById =
//   (id: number) => (state: RootState) =>
//     state.groundControlPoints[id];
//
// export const selectGroundControlPointsOnImage =
//   (imageId: number) => (state: RootState) =>
//     state.groundControlPoints.filter((x) =>
//       x.linkedPoints.some((y) => y.imageId === imageId)
//     );

export default groundControlPointsSlice.reducer;
