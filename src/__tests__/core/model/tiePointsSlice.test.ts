import reducer, {
  addLinkedImageByPointId,
  addPoint,
  removeLinkedImageByPointId,
  removePointByPointId,
  TiePoint,
} from '../../../core/model/slices/tiePointsSlice';
import { PointOnImage } from '../../../core/model/interfaces/pointOnImageInterface';

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

    test('should add and removed linked images correctly', () => {
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
        reducer(initialState, addLinkedImageByPointId(newPointId, newImage))
      ).toEqual(finalState);

      expect(
        reducer(finalState, removeLinkedImageByPointId(newPointId, newImageId))
      ).toEqual(initialState);
    });

    test('should throw an error when operating on a point with an incorrect ID', () => {
      const newPointId = 42;
      const initialState: TiePoint[] = [
        {
          pointId: newPointId,
          linkedImages: [
            {
              pointId: newPointId,
              imageId: 1,
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
          addLinkedImageByPointId(newPointId + 1, {
            pointId: newPointId,
            imageId: 2,
            x: 2,
            y: 3,
            source: 'MANUAL',
          })
        )
      ).toThrow(Error);

      expect(() =>
        reducer(initialState, removeLinkedImageByPointId(newPointId + 1, 1))
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
          addPoint({ pointId: newPointId, linkedImages: [] })
        )
      ).toThrow();

      expect(() =>
        reducer(
          initialState,
          addLinkedImageByPointId(newPointId, {
            pointId: newPointId,
            imageId: newImageId,
            x: 1,
            y: 2,
            source: 'MANUAL',
          })
        )
      ).toThrow();
    });

    test('should throw an error when trying to add a linked image with a different Point ID', () => {
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
          addLinkedImageByPointId(newPointId, {
            pointId: newPointId + 1,
            imageId: newImageId,
            x: 1,
            y: 2,
            source: 'MANUAL',
          })
        )
      ).toThrow();
    });
  });
