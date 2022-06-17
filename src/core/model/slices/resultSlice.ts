import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CameraPosition, RealPoint } from './common/interfaces';
import type { RootState } from '../store';
import {
  addCameraPositionCommon,
  addPointCommon,
  removeCameraPositionCommon,
  removePointCommon, setLinkedPointYCommon
} from './common/reducers';
import { TiePointMap } from './tiePointsSlice';

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

    importPoints: (state: Result, action: PayloadAction<RealPoint[]>) => {
      state.points = [];

      action.payload.sort((a, b) => a.pointId - b.pointId);

      for (let i = 0; i < action.payload.length; i += 1) {
        // TODO: change this if IDs don't start from 1
        if (action.payload[i].pointId - 1 === i) {
          addPointCommon(state.points, {
            type: action.type,
            payload: action.payload[i],
          });
        } else {
          throw Error(
            `Inconsistent data: ${i} points${i > 1 ? 's' : ''} 
              accepted, ${action.payload.length - i} points${action.payload.length - i > 1 ? 's' : ''} rejected`
          );
        }
      }
    },

    addCamera: (state: Result, action: PayloadAction<CameraPosition>) =>
      addCameraPositionCommon(state.cameras, action),

    removeCameraByImageId: (state: Result, action: PayloadAction<number>) =>
      removeCameraPositionCommon(state.cameras, action),

    setCameraXc: {
      prepare: (cameraId: number, xc: number) => ({
        payload: { cameraId, xc },
      }),

      reducer: (
        state: Result,
        action: PayloadAction<{ cameraId: number; xc: number }>
      ) => {
        if (action.payload.cameraId < 0 || action.payload.cameraId >= state.cameras.length)
          throw Error('Invalid cameraId');

        state.cameras[action.payload.cameraId].xc = action.payload.xc;
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
        if (action.payload.cameraId < 0 || action.payload.cameraId >= state.cameras.length)
          throw Error('Invalid cameraId');

        state.cameras[action.payload.cameraId].yc = action.payload.yc;
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
        if (action.payload.cameraId < 0 || action.payload.cameraId >= state.cameras.length)
          throw Error('Invalid cameraId');

        state.cameras[action.payload.cameraId].zc = action.payload.zc;
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
        if (action.payload.cameraId < 0 || action.payload.cameraId >= state.cameras.length)
          throw Error('Invalid cameraId');

        state.cameras[action.payload.cameraId].omega = action.payload.omega;
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
        if (action.payload.cameraId < 0 || action.payload.cameraId >= state.cameras.length)
          throw Error('Invalid cameraId');

        state.cameras[action.payload.cameraId].phi = action.payload.phi;
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
        if (action.payload.cameraId < 0 || action.payload.cameraId >= state.cameras.length)
          throw Error('Invalid cameraId');

        state.cameras[action.payload.cameraId].kappa = action.payload.kappa;
      },
    },

    importCameras: (state: Result, action: PayloadAction<CameraPosition[]>) => {
      state.cameras = [];

      action.payload.sort((a, b) => a.imageId - b.imageId);

      for (let i = 0; i < action.payload.length; i += 1) {
        // TODO: change this if IDs don't start from 1
        if (action.payload[i].imageId - 1 === i) {
          addCameraPositionCommon(state.cameras, {
            type: action.type,
            payload: action.payload[i],
          });
        } else {
          throw Error(
            `Inconsistent data: ${i} camera position${i > 1 ? 's' : ''} 
              accepted, ${action.payload.length - i} camera position${action.payload.length - i > 1 ? 's' : ''} rejected`
          );
        }
      }
    },
  },
});

export const {
  addPoint,
  removePointByPointId,
  importPoints,
  addCamera,
  removeCameraByImageId,
  setCameraXc,
  setCameraYc,
  setCameraZc,
  setCameraOmega,
  setCameraPhi,
  setCameraKappa,
  importCameras,
} = resultSlice.actions;

export const selectAllPoints = (state: RootState) => state.result.points;

export const selectAllCameras = (state: RootState) => state.result.cameras;

export const selectPointById = (id: number) => (state: RootState) =>
  state.result.points[id];

export const selectCameraById = (id: number) => (state: RootState) =>
  state.result.cameras[id];

export default resultSlice.reducer;
