import reducer, {
  Result,
  addPoint,
  removePointByPointId,
  addCamera,
  removeCameraByImageId,
} from '../../../core/model/slices/resultSlice';
import {
  CameraPosition,
  RealPoint,
} from '../../../core/model/slices/common/interfaces';

// eslint-disable-next-line jest/no-export
export default () =>
  describe('Result Slice', () => {
    test('should return the initial state', () => {
      expect(reducer(undefined, { type: undefined })).toEqual({
        points: [],
        cameras: [],
      } as Result);
    });

    test('should add and remove points and cameras correctly', () => {
      const initialState = {
        points: [] as RealPoint[],
        cameras: [] as CameraPosition[],
      };

      const newPointId = 42;
      const newPoint = { pointId: newPointId, x: 1, y: 2, z: 3 };

      const newImageId = 12;
      const newCamera = {
        imageId: newImageId,
        xc: 1,
        yc: 2,
        zc: 3,
        kappa: -1,
        omega: -2,
        phi: -3,
      };

      const finalState1 = {
        points: [newPoint],
        cameras: [] as CameraPosition[],
      };

      const finalState2 = {
        points: [] as RealPoint[],
        cameras: [newCamera],
      };

      expect(reducer(initialState, addPoint(newPoint))).toEqual(finalState1);
      expect(reducer(finalState1, removePointByPointId(newPointId))).toEqual(
        initialState
      );

      expect(reducer(initialState, addCamera(newCamera))).toEqual(finalState2);
      expect(reducer(finalState2, removeCameraByImageId(newImageId))).toEqual(
        initialState
      );
    });

    test('should throw an error when trying to add non-unique IDs', () => {
      const newPointId = 42;
      const newImageId = 12;

      const initialState = {
        points: [{ pointId: newPointId, x: 1, y: 2, z: 3 }],
        cameras: [
          {
            imageId: newImageId,
            xc: 1,
            yc: 2,
            zc: 3,
            kappa: -1,
            omega: -2,
            phi: -3,
          },
        ],
      };

      expect(() =>
        reducer(
          initialState,
          addPoint({ pointId: newPointId, x: 4, y: 5, z: 6 })
        )
      ).toThrow();

      expect(() =>
        reducer(
          initialState,
          addCamera({
            imageId: newImageId,
            xc: 4,
            yc: 5,
            zc: 6,
            kappa: -4,
            omega: -5,
            phi: -6,
          })
        )
      ).toThrow();
    });
  });
