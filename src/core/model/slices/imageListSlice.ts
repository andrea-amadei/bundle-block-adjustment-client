import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface InputImage {
  id: number;
  name: string;
  path: string;
  width: number;
  height: number;
}

export interface InputImageToIdMap {
  [id: number]: InputImage;
}

export const ImageListSlice = createSlice({
  name: 'imageList',
  initialState: {} as InputImageToIdMap,
  reducers: {
    addImage: (state: InputImageToIdMap, action: PayloadAction<InputImage>) => {
      state[action.payload.id] = action.payload;
    },

    setImageNameById: {
      prepare: (id: number, name: string) => ({
        payload: { id, name },
      }),

      reducer: (
        state: InputImageToIdMap,
        action: PayloadAction<{ id: number; name: string }>
      ) => {
        if (!(action.payload.id in state)) throw Error('Invalid image id');

        if (action.payload.name === '')
          state[action.payload.id].name = `Image ${action.payload.id}`;
        else
          state[action.payload.id].name = action.payload.name;
      },
    },

    removeImageById: (state: InputImageToIdMap, action: PayloadAction<number>) => {
      delete state[action.payload];
    },
    removeAllImages: (state: InputImageToIdMap) => {
      Object.keys(imgId => {
        delete state[imgId];
      });
    },
  },
});

export const {
  addImage,
  setImageNameById,
  removeImageById,
  removeAllImages
} = ImageListSlice.actions;

export const selectAllImages = (state: RootState) =>
  Object.values(state.imageList) as InputImage[];

export const selectImagesMap = (state: RootState) =>
  state.imageList as InputImageToIdMap;

export const selectImageById = (id: number) => (state: RootState) =>
  state.imageList[id] as InputImage;

export default ImageListSlice.reducer;
