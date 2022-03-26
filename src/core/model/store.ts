import { configureStore } from '@reduxjs/toolkit';
import cameraReducer from './slices/cameraSlice';
import groundControlPointsReducer from './slices/groundControlPointsSlice';
import tiePointsReducer from './slices/tiePointsSlice';
import resultSliceReducer from './slices/resultSlice';

const store = configureStore({
  reducer: {
    camera: cameraReducer,
    groundControlPoints: groundControlPointsReducer,
    tiePoints: tiePointsReducer,
    result: resultSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
