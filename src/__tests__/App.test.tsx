import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../renderer/App';

import reducer, {
  setXi0,
  setEta0,
  setC,
  setK1,
  setK2,
  setK3,
  setP1,
  setP2,
  setA1,
  setA2,
} from '../core/model/slices/cameraSlice';

describe('App', () => {
  test('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});

describe('Core', () => {
  describe('Model', () => {
    describe('Camera Slice', () => {
      test('should return the initial state', () => {
        expect(reducer(undefined, { type: undefined })).toEqual({
          xi0: 0,
          eta0: 0,
          c: 0,
          k1: 0,
          k2: 0,
          k3: 0,
          p1: 0,
          p2: 0,
          a1: 0,
          a2: 0,
        });
      });

      test('should set and get any value correctly', () => {
        const initialState = {
          xi0: 0,
          eta0: 0,
          c: 0,
          k1: 0,
          k2: 0,
          k3: 0,
          p1: 0,
          p2: 0,
          a1: 0,
          a2: 0,
        };

        expect(reducer(initialState, setXi0(1))).toEqual({
          xi0: 1,
          eta0: 0,
          c: 0,
          k1: 0,
          k2: 0,
          k3: 0,
          p1: 0,
          p2: 0,
          a1: 0,
          a2: 0,
        });

        expect(reducer(initialState, setEta0(2))).toEqual({
          xi0: 0,
          eta0: 2,
          c: 0,
          k1: 0,
          k2: 0,
          k3: 0,
          p1: 0,
          p2: 0,
          a1: 0,
          a2: 0,
        });

        expect(reducer(initialState, setC(3))).toEqual({
          xi0: 0,
          eta0: 0,
          c: 3,
          k1: 0,
          k2: 0,
          k3: 0,
          p1: 0,
          p2: 0,
          a1: 0,
          a2: 0,
        });

        expect(reducer(initialState, setK1(4))).toEqual({
          xi0: 0,
          eta0: 0,
          c: 0,
          k1: 4,
          k2: 0,
          k3: 0,
          p1: 0,
          p2: 0,
          a1: 0,
          a2: 0,
        });

        expect(reducer(initialState, setK2(5))).toEqual({
          xi0: 0,
          eta0: 0,
          c: 0,
          k1: 0,
          k2: 5,
          k3: 0,
          p1: 0,
          p2: 0,
          a1: 0,
          a2: 0,
        });

        expect(reducer(initialState, setK3(6))).toEqual({
          xi0: 0,
          eta0: 0,
          c: 0,
          k1: 0,
          k2: 0,
          k3: 6,
          p1: 0,
          p2: 0,
          a1: 0,
          a2: 0,
        });

        expect(reducer(initialState, setP1(7))).toEqual({
          xi0: 0,
          eta0: 0,
          c: 0,
          k1: 0,
          k2: 0,
          k3: 0,
          p1: 7,
          p2: 0,
          a1: 0,
          a2: 0,
        });

        expect(reducer(initialState, setP2(8))).toEqual({
          xi0: 0,
          eta0: 0,
          c: 0,
          k1: 0,
          k2: 0,
          k3: 0,
          p1: 0,
          p2: 8,
          a1: 0,
          a2: 0,
        });

        expect(reducer(initialState, setA1(9))).toEqual({
          xi0: 0,
          eta0: 0,
          c: 0,
          k1: 0,
          k2: 0,
          k3: 0,
          p1: 0,
          p2: 0,
          a1: 9,
          a2: 0,
        });

        expect(reducer(initialState, setA2(10))).toEqual({
          xi0: 0,
          eta0: 0,
          c: 0,
          k1: 0,
          k2: 0,
          k3: 0,
          p1: 0,
          p2: 0,
          a1: 0,
          a2: 10,
        });
      });
    });
  });
});
