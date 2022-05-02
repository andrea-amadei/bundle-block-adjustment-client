import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { imgTest } from "./ModelTestData";

export interface InputImage {
  id: number;
  name: string;
  path: string;
}

interface InputImageToIdMap {
  [id: number]: InputImage;
}

export const ImageListSlice = createSlice({
  name: 'imageList',
  initialState: imgTest as InputImageToIdMap,
  reducers: {
    addImage: (state: InputImageToIdMap, action: PayloadAction<InputImage>) => {
      state[action.payload.id] = action.payload;
    },
    removeImageById: (state: InputImageToIdMap, action: PayloadAction<number>) => {
      delete state[action.payload];
    },
  },
});

export const {
  addImage,
  removeImageById,
} = ImageListSlice.actions;

export const selectAllImages = (state: RootState) =>
  Object.values(state.imageList) as InputImage[];

export const selectImageById = (id: number) => (state: RootState) =>
  state.imageList[id] as InputImage;

export default ImageListSlice.reducer;
