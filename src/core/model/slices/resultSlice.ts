import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CameraPosition, RealPoint } from './common/interfaces';
import type { RootState } from '../store';
import {
  addCameraPositionCommon,
  addPointCommon,
  removeCameraPositionCommon,
  removePointCommon,
} from './common/reducers';

export interface Result {
  points: RealPoint[];
  cameras: CameraPosition[];
}

const initialState = {
  points: [],
  cameras: [],
} as Result;

export const resultSlice = createSlice({
  name: 'result',
  initialState,
  reducers: {
    addPoint: (state: Result, action: PayloadAction<RealPoint>) =>
      addPointCommon(state.points, action),

    removePointByPointId: (state: Result, action: PayloadAction<number>) =>
      removePointCommon(state.points, action),

    addCamera: (state: Result, action: PayloadAction<CameraPosition>) =>
      addCameraPositionCommon(state.cameras, action),

    removeCameraByImageId: (state: Result, action: PayloadAction<number>) =>
      removeCameraPositionCommon(state.cameras, action),
  },
});

export const {
  addPoint,
  removePointByPointId,
  addCamera,
  removeCameraByImageId,
} = resultSlice.actions;

export const selectAllPoints = (state: RootState) => state.result.points;

export const selectAllCameras = (state: RootState) => state.result.cameras;

export const selectPointById = (id: number) => (state: RootState) =>
  state.result.points[id];

export const selectCameraById = (id: number) => (state: RootState) =>
  state.result.cameras[id];

export default resultSlice.reducer;
