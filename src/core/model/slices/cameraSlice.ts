import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface CameraState {
  xi0: number;
  eta0: number;

  c: number;

  k1: number;
  k2: number;
  k3: number;

  p1: number;
  p2: number;

  a1: number;
  a2: number;

  pixel: number;
}

const initialState = {
  xi0: 0,
  eta0: 0,
  c: 0,
  k1: 0,
  k2: 0,
  k3: 0,
  p1: 0,
  p2: 0,
  a1: 0,
  a2: 0,
  pixel: 0,
} as CameraState;

export const cameraSlice = createSlice({
  name: 'camera',
  initialState,

  reducers: {
    setXi0: (state = initialState, action: PayloadAction<number>) => {
      state.xi0 = action.payload;
    },

    setEta0: (state = initialState, action: PayloadAction<number>) => {
      state.eta0 = action.payload;
    },

    setC: (state = initialState, action: PayloadAction<number>) => {
      state.c = action.payload;
    },

    setK1: (state = initialState, action: PayloadAction<number>) => {
      state.k1 = action.payload;
    },

    setK2: (state = initialState, action: PayloadAction<number>) => {
      state.k2 = action.payload;
    },

    setK3: (state = initialState, action: PayloadAction<number>) => {
      state.k3 = action.payload;
    },

    setP1: (state = initialState, action: PayloadAction<number>) => {
      state.p1 = action.payload;
    },

    setP2: (state = initialState, action: PayloadAction<number>) => {
      state.p2 = action.payload;
    },

    setA1: (state = initialState, action: PayloadAction<number>) => {
      state.a1 = action.payload;
    },

    setA2: (state = initialState, action: PayloadAction<number>) => {
      state.a2 = action.payload;
    },

    setPixel: (state = initialState, action: PayloadAction<number>) => {
      state.pixel = action.payload;
    },
  },
});

export const {
  setXi0,
  setEta0,
  setC,
  setK1,
  setK2,
  setK3,
  setP1,
  setP2,
  setA1,
  setA2,
  setPixel,
} = cameraSlice.actions;

export const selectXi0 = (state: RootState) => state.camera.xi0;
export const selectEta0 = (state: RootState) => state.camera.eta0;
export const selectC = (state: RootState) => state.camera.c;
export const selectK1 = (state: RootState) => state.camera.k1;
export const selectK2 = (state: RootState) => state.camera.k2;
export const selectK3 = (state: RootState) => state.camera.k3;
export const selectP1 = (state: RootState) => state.camera.p1;
export const selectP2 = (state: RootState) => state.camera.p2;
export const selectA1 = (state: RootState) => state.camera.a1;
export const selectA2 = (state: RootState) => state.camera.a2;
export const selectPixel = (state: RootState) => state.camera.pixel;

export const selectAllCameraParams = (state: RootState) => state.camera as CameraState;

export default cameraSlice.reducer;
