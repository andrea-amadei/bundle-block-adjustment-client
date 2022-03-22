import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PointOnImage } from '../interfaces/pointOnImageInterface';
import type { RootState } from '../store';

export interface TiePoint {
  pointId: number;
  linkedImages: PointOnImage[];
}
export const tiePointsSlice = createSlice({
  name: 'tiePoints',

  // TODO: perhaps it is better to convert the state to a map?
  initialState: [] as TiePoint[],

  reducers: {
    addPoint: (state: TiePoint[], action: PayloadAction<TiePoint>) => {
      if (state.map((x) => x.pointId).includes(action.payload.pointId))
        throw Error('Point ID must be unique');

      state.push(action.payload);
    },

    removePointByPointId: (state: TiePoint[], action: PayloadAction<number>) => {
      state.splice(
        state.findIndex((x) => x.pointId === action.payload),
        1
      );
    },

    addLinkedImageByPointId: {
      prepare: (id: number, image: PointOnImage) => ({
        payload: { id, image },
      }),

      reducer: (state: TiePoint[], action: PayloadAction<{ id: number, image: PointOnImage }>) => {
        if (!state.map((x) => x.pointId).includes(action.payload.id))
          throw Error('No existing point with given ID');

        if (action.payload.id !== action.payload.image.pointId)
          throw Error("Point ID and image's point ID must be identical");

        const point = state.filter((p) => p.pointId === action.payload.id)[0];

        if (
          point.linkedImages
            .map((x) => x.imageId)
            .includes(action.payload.image.imageId)
        )
          throw Error('Image ID must be unique');

        point.linkedImages.push(action.payload.image);
      },
    },

    removeLinkedImageByPointId: {
      prepare: (pointId: number, imageId: number) => ({
        payload: { pointId, imageId },
      }),

      reducer: (state: TiePoint[], action: PayloadAction<{ pointId: number, imageId: number }>) => {
        if (!state.map((x) => x.pointId).includes(action.payload.pointId))
          throw Error('No existing point with given ID');

        const images = state.filter(
          (p) => p.pointId === action.payload.pointId
        )[0].linkedImages;

        images.splice(
          images.findIndex((p) => p.imageId === action.payload.imageId),
          1
        );
      },
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
