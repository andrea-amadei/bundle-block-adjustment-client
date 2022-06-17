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
  points: {
    [id: number]: RealPoint,
  };
  cameras: {
    [id: number]: CameraPosition
  };
}

const initialState = {
  points: [],
  cameras: [],
} as Result;


function getCameraOrThrow(state: Result, cameraId: number) {
  if (!(cameraId in state.cameras))
    throw Error(`Camera Id ${cameraId} not found`);
  return state.cameras[cameraId];
}

export const resultSlice = createSlice({
  name: 'result',
  initialState,
  reducers: {
    addPoint: (state: Result, action: PayloadAction<RealPoint>) =>
      addPointCommon(state.points, action),

    removePointByPointId: (state: Result, action: PayloadAction<number>) =>
      removePointCommon(state.points, action),

    importPoints: (state: Result, action: PayloadAction<RealPoint[]>) => {
      state.points = action.payload.reduce((acc, point) => ({...acc, [point.pointId]: point}), {});
    },

    addCamera: (state: Result, action: PayloadAction<CameraPosition>) =>
      addCameraPositionCommon(state.cameras, action),

    removeCameraByImageId: (state: Result, action: PayloadAction<number>) =>
      removeCameraPositionCommon(state.cameras, action),

    removeAllCameras: (state: Result) => {
      Object.keys(state.cameras).forEach(imgId => {
        delete state.cameras[parseInt(imgId, 10)];
      })
    },

    setCameraXc: {
      prepare: (cameraId: number, xc: number) => ({
        payload: { cameraId, xc },
      }),

      reducer: (
        state: Result,
        action: PayloadAction<{ cameraId: number; xc: number }>
      ) => {
        getCameraOrThrow(state, action.payload.cameraId).xc = action.payload.xc;
      },
    },

    setCameraYc: {
      prepare: (cameraId: number, yc: number) => ({
        payload: { cameraId, yc },
      }),

      reducer: (
        state: Result,
        action: PayloadAction<{ cameraId: number; yc: number }>
      ) => {
        getCameraOrThrow(state, action.payload.cameraId).yc = action.payload.yc;
      },
    },

    setCameraZc: {
      prepare: (cameraId: number, zc: number) => ({
        payload: { cameraId, zc },
      }),

      reducer: (
        state: Result,
        action: PayloadAction<{ cameraId: number; zc: number }>
      ) => {
        getCameraOrThrow(state, action.payload.cameraId).zc = action.payload.zc;
      },
    },

    setCameraOmega: {
      prepare: (cameraId: number, omega: number) => ({
        payload: { cameraId, omega },
      }),

      reducer: (
        state: Result,
        action: PayloadAction<{ cameraId: number; omega: number }>
      ) => {
        getCameraOrThrow(state, action.payload.cameraId).omega = action.payload.omega;
      },
    },

    setCameraPhi: {
      prepare: (cameraId: number, phi: number) => ({
        payload: { cameraId, phi },
      }),

      reducer: (
        state: Result,
        action: PayloadAction<{ cameraId: number; phi: number }>
      ) => {
        getCameraOrThrow(state, action.payload.cameraId).phi = action.payload.phi;
      },
    },

    setCameraKappa: {
      prepare: (cameraId: number, kappa: number) => ({
        payload: { cameraId, kappa },
      }),

      reducer: (
        state: Result,
        action: PayloadAction<{ cameraId: number; kappa: number }>
      ) => {
        getCameraOrThrow(state, action.payload.cameraId).kappa = action.payload.kappa;
      },
    },

    importCameras: (state: Result, action: PayloadAction<CameraPosition[]>) => {
      state.cameras = action.payload.reduce((acc, camera) => ({...acc, [camera.imageId]: camera}), {});
    },
  },
});

export const {
  addPoint,
  removePointByPointId,
  importPoints,
  addCamera,
  removeCameraByImageId,
  removeAllCameras,
  setCameraXc,
  setCameraYc,
  setCameraZc,
  setCameraOmega,
  setCameraPhi,
  setCameraKappa,
  importCameras,
} = resultSlice.actions;

export const selectAllPoints = (state: RootState) => state.result.points;
export const selectAllPointsList = (state: RootState) => Object.values(state.result.points);

export const selectAllCameras = (state: RootState) => state.result.cameras;
export const selectAllCamerasList = (state: RootState) => Object.values(state.result.cameras);

export const selectPointById = (id: number) => (state: RootState) =>
  state.result.points[id] as RealPoint;

export const selectCameraById = (id: number) => (state: RootState) =>
  state.result.cameras[id] as CameraPosition;

export default resultSlice.reducer;
