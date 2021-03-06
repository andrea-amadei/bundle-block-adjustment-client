import reducer, {
  addLinkedPointByPointId,
  addPoint,
  GroundControlPoint,
  PointOnImageGCP,
  removeLinkedPointByPointId,
  removePointByPointId,
  setLinkedPointX,
  setLinkedPointY,
  setXByPointId,
  setYByPointId,
  setZByPointId,
} from '../../../core/model/slices/groundControlPointsSlice';

// eslint-disable-next-line jest/no-export
export default () =>
  describe('GCP Slice', () => {
    test('should return the initial state', () => {
      expect(reducer(undefined, { type: undefined })).toEqual([]);
    });

    test('should add and remove a point correctly', () => {
      const newPointId = 42;
      const newPoint: GroundControlPoint = {
        pointId: newPointId,
        linkedImages: [],
        x: 1,
        y: 2,
        z: 3,
      };

      const initialState: GroundControlPoint[] = [];
      const finalState: GroundControlPoint[] = [newPoint];

      expect(reducer(initialState, addPoint(newPoint))).toEqual(finalState);

      expect(reducer(finalState, removePointByPointId(newPointId))).toEqual(
        initialState
      );
    });

    test('should set x, y and z correctly', () => {
      const newPointId = 42;
      const initialState: GroundControlPoint[] = [
        {
          pointId: newPointId,
          linkedImages: [],
          x: 1,
          y: 2,
          z: 3,
        },
      ];

      const newX = 3;
      const newY = 5;
      const newZ = 7;

      expect(reducer(initialState, setXByPointId(newPointId, newX))).toEqual([
        {
          pointId: newPointId,
          linkedPoints: [],
          x: newX,
          y: 2,
          z: 3,
        },
      ]);
      expect(reducer(initialState, setYByPointId(newPointId, newY))).toEqual([
        {
          pointId: newPointId,
          linkedPoints: [],
          x: 1,
          y: newY,
          z: 3,
        },
      ]);
      expect(reducer(initialState, setZByPointId(newPointId, newZ))).toEqual([
        {
          pointId: newPointId,
          linkedPoints: [],
          x: 1,
          y: 2,
          z: newZ,
        },
      ]);
    });

    test('should add and removed linked points correctly', () => {
      const newPointId = 42;
      const newImageId = 7;

      const newImage: PointOnImageGCP = {
        pointId: newPointId,
        imageId: newImageId,
        x: 1,
        y: 2,
        source: 'MANUAL',
      };

      const initialState: GroundControlPoint[] = [
        {
          pointId: newPointId,
          linkedImages: [],
          x: 1,
          y: 2,
          z: 3,
        },
      ];

      const finalState: GroundControlPoint[] = [
        {
          pointId: newPointId,
          linkedImages: [newImage],
          x: 1,
          y: 2,
          z: 3,
        },
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
      const initialState: GroundControlPoint[] = [
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
          x: 1,
          y: 2,
          z: 3,
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
          x: 1,
          y: 2,
          z: 3,
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
          x: 1,
          y: 2,
          z: 3,
        },
      ]);
    });

    test('should throw an error when operating on a point with an incorrect ID', () => {
      const newPointId = 42;
      const newImageId = 1;
      const initialState: GroundControlPoint[] = [
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
          x: 1,
          y: 2,
          z: 3,
        },
      ];

      expect(() =>
        reducer(initialState, setXByPointId(newPointId + 1, 0))
      ).toThrow();

      expect(() =>
        reducer(initialState, setYByPointId(newPointId + 1, 0))
      ).toThrow();

      expect(() =>
        reducer(initialState, setZByPointId(newPointId + 1, 0))
      ).toThrow();

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
      const initialState: GroundControlPoint[] = [
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
          x: 1,
          y: 2,
          z: 3,
        },
      ];

      expect(() =>
        reducer(
          initialState,
          addPoint({
            pointId: newPointId,
            linkedImages: {},
            x: 1,
            y: 2,
            z: 3,
          })
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
