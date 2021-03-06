import reducer, {
  addLinkedPointByPointId,
  addPoint,
  removeLinkedPointByPointId,
  removePointByPointId,
  TiePoint,
  setLinkedPointX,
  setLinkedPointY,
} from '../../../core/model/slices/tiePointsSlice';
import { PointOnImage } from '../../../core/model/slices/common/interfaces';

// eslint-disable-next-line jest/no-export
export default () =>
  describe('Tie Points Slice', () => {
    test('should return the initial state', () => {
      expect(reducer(undefined, { type: undefined })).toEqual([]);
    });

    test('should add and remove a point correctly', () => {
      const newPointId = 42;
      const newPoint: TiePoint = { pointId: newPointId, linkedImages: [] };

      const initialState: TiePoint[] = [];
      const finalState: TiePoint[] = [newPoint];

      expect(reducer(initialState, addPoint(newPoint))).toEqual(finalState);

      expect(reducer(finalState, removePointByPointId(newPointId))).toEqual(
        initialState
      );
    });

    test('should add and removed linked points correctly', () => {
      const newPointId = 42;
      const newImageId = 7;

      const newImage: PointOnImage = {
        pointId: newPointId,
        imageId: newImageId,
        x: 1,
        y: 2,
        source: 'MANUAL',
      };

      const initialState: TiePoint[] = [
        { pointId: newPointId, linkedImages: [] },
      ];

      const finalState: TiePoint[] = [
        { pointId: newPointId, linkedImages: [newImage] },
      ];

      expect(
        reducer(initialState, addLinkedPointByPointId(newImage))
      ).toEqual(finalState);

      expect(
        reducer(finalState, removeLinkedPointByPointId(newPointId, newImageId))
      ).toEqual(initialState);
    });

    test('should set x and y of linked points correctly', () => {
      const newPointId = 42;
      const newImageId = 1;
      const initialState: TiePoint[] = [
        {
          pointId: newPointId,
          linkedImages: [
            {
              pointId: newPointId,
              imageId: newImageId,
              x: 0,
              y: 0,
              source: 'MANUAL',
            },
          ],
        },
      ];

      expect(
        reducer(initialState, setLinkedPointX(newPointId, newImageId, 3))
      ).toEqual([
        {
          pointId: newPointId,
          linkedPoints: [
            {
              pointId: newPointId,
              imageId: newImageId,
              x: 3,
              y: 0,
              source: 'MANUAL',
            },
          ],
        },
      ]);

      expect(
        reducer(initialState, setLinkedPointY(newPointId, newImageId, 3))
      ).toEqual([
        {
          pointId: newPointId,
          linkedPoints: [
            {
              pointId: newPointId,
              imageId: newImageId,
              x: 0,
              y: 3,
              source: 'MANUAL',
            },
          ],
        },
      ]);
    });

    test('should throw an error when operating on a point with an incorrect ID', () => {
      const newPointId = 42;
      const newImageId = 1;
      const initialState: TiePoint[] = [
        {
          pointId: newPointId,
          linkedImages: [
            {
              pointId: newPointId,
              imageId: newImageId,
              x: 1,
              y: 2,
              source: 'MANUAL',
            },
          ],
        },
      ];

      expect(() =>
        reducer(initialState, removeLinkedPointByPointId(newPointId + 1, 1))
      ).toThrow(Error);

      expect(() =>
        reducer(initialState, removeLinkedPointByPointId(newPointId + 1, 1))
      ).toThrow(Error);

      expect(() =>
        reducer(initialState, setLinkedPointX(newPointId + 1, newImageId, 1))
      ).toThrow(Error);

      expect(() =>
        reducer(initialState, setLinkedPointX(newPointId, newImageId + 1, 1))
      ).toThrow(Error);

      expect(() =>
        reducer(initialState, setLinkedPointY(newPointId + 1, newImageId, 1))
      ).toThrow(Error);

      expect(() =>
        reducer(initialState, setLinkedPointY(newPointId, newImageId + 1, 1))
      ).toThrow(Error);
    });

    test('should throw an error when trying to add non-unique IDs', () => {
      const newPointId = 42;
      const newImageId = 3;
      const initialState: TiePoint[] = [
        {
          pointId: newPointId,
          linkedImages: [
            {
              pointId: newPointId,
              imageId: newImageId,
              x: 1,
              y: 2,
              source: 'MANUAL',
            },
          ],
        },
      ];

      expect(() =>
        reducer(
          initialState,
          addPoint({ pointId: newPointId, linkedImages: {} })
        )
      ).toThrow();

      expect(() =>
        reducer(
          initialState,
          addLinkedPointByPointId({
            pointId: newPointId,
            imageId: newImageId,
            x: 1,
            y: 2,
            source: 'MANUAL',
          })
        )
      ).toThrow();
    });

  });
