import { configureStore } from '@reduxjs/toolkit';
import cameraReducer from './cameraSlice';
import groundControlPointsReducer from './groundControlPointsSlice';

const store = configureStore({
  reducer: {
    camera: cameraReducer,
    groundControlPoints: groundControlPointsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
