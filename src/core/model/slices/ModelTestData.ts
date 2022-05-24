import { TiePoint } from './tiePointsSlice';
import { GroundControlPoint } from './groundControlPointsSlice';

export const imgTest = {
  1: {
    id: 1,
    name: 'Img1',
    path: 'https://images.unsplash.com/photo-1648818172118-093be9c12d59?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
  },
  2: {
    id: 2,
    name: 'Img2',
    path: 'https://images.unsplash.com/photo-1615472669810-e72da447b314?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=749&q=80',
  },
  3: {
    id: 3,
    name: 'Img3',
    path: 'https://images.unsplash.com/photo-1611363279288-55e33723ac06?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
  },
  4: { id: 4,
    name: 'Vaporwave',
    path: 'https://i.redd.it/1iwcit1gidyy.jpg'
  },
  5: {
    id: 5,
    name: 'Random',
    path: 'https://www.dcode.fr/tools/image-randomness/images/random-dcode.png',
  },
};

export const tpTest: TiePoint[] = [
  {
    pointId: 1,
    linkedPoints: [
      {
        pointId: 1,
        x: 1,
        y: 1,
        imageId: 1,
        source: 'MANUAL',
      },
      {
        pointId: 1,
        x: 10,
        y: 10,
        imageId: 2,
        source: 'MANUAL',
      },
      {
        pointId: 1,
        x: 15,
        y: 15,
        imageId: 3,
        source: 'MANUAL',
      },
    ],
  },
  {
    pointId: 2,
    linkedPoints: [
      {
        pointId: 2,
        x: 4,
        y: 8,
        imageId: 1,
        source: 'IMPORTED',
      },
      {
        pointId: 2,
        x: 8,
        y: 16,
        imageId: 2,
        source: 'MANUAL',
      },
    ],
  },
  {
    pointId: 3,
    linkedPoints: [
      {
        pointId: 3,
        x: 15,
        y: 30,
        imageId: 1,
        source: 'MANUAL',
      },
    ],
  },
  {
    pointId: 1000,
    linkedPoints: [
      {
        pointId: 1000,
        x: 30,
        y: 30,
        imageId: 5,
        source: 'IMPORTED',
      },
    ],
  },
  {
    pointId: 1001,
    linkedPoints: [
      {
        pointId: 1001,
        x: 100,
        y: 20,
        imageId: 5,
        source: 'IMPORTED',
      },
    ],
  },
];

export const gcpTest: GroundControlPoint[] = [
  {
    pointId: 1,
    x: 20,
    y: 40,
    z: 60,
    linkedPoints: [
      {
        pointId: 1,
        x: 180,
        y: 180,
        imageId: 1,
        source: 'MANUAL',
      },
    ],
  },
];
