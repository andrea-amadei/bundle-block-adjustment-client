import { configureStore } from '@reduxjs/toolkit';
import cameraReducer from './slices/cameraSlice';
import groundControlPointsReducer from './slices/groundControlPointsSlice';
import tiePointsReducer from './slices/tiePointsSlice';

const store = configureStore({
  reducer: {
    camera: cameraReducer,
    groundControlPoints: groundControlPointsReducer,
    tiePoints: tiePointsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
