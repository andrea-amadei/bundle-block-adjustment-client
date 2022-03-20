import { createSlice } from '@reduxjs/toolkit';
import { PointOnImage } from './pointInImageInterface';
import type { RootState } from './store';

type PointOnImageGCP = { PointOnImage: 'MANUAL' | 'IMPORTED' } & PointOnImage;

interface GroundControlPoint {
  pointId: number;
  linkedImages: PointOnImageGCP[];
  x: number;
  y: number;
  z: number;
}

export interface GroundControlPointsState {
  groundControlPointsList: GroundControlPoint[];
}

const initialState = {
  groundControlPointsList: [],
} as GroundControlPointsState;

export const groundControlPointsSlice = createSlice({
  name: 'groundControlPoints',
  initialState,

  // TODO: add reducers
  reducers: {},
});

// TODO: add reducers
// export const { } = groundControlPointsSlice.actions;

export const selectGroundControlPointById =
  (id: number) => (state: RootState) =>
    state.groundControlPoints.groundControlPointsList[id];

export const selectGroundControlPointListInImage =
  (imageId: number) => (state: RootState) =>
    state.groundControlPoints.groundControlPointsList.filter((x) =>
      x.linkedImages.some((y) => y.imageId === imageId)
    );

export default groundControlPointsSlice.reducer;
