import cameraSliceTest from './core/model/cameraSlice.test';
import groundControlPointsSliceTest from './core/model/groundControlPointsSlice.test';
import tiePointsSliceTest from './core/model/tiePointsSlice.test';
import resultSliceTest from './core/model/resultSlice.test';
import appTest from './app/App.test';

describe('All', () => {
  describe('Core', () => {
    describe('Model', () => {
      cameraSliceTest();
      groundControlPointsSliceTest();
      tiePointsSliceTest();
      resultSliceTest();
    });
  });

  describe('App', () => {
    appTest();
  });
});
