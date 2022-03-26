export interface PointOnImage {
  pointId: number;
  imageId: number;
  x: number;
  y: number;
  source: 'AUTO' | 'MANUAL' | 'IMPORTED';
}

export interface Point {
  pointId: number;
}

export interface VirtualPoint<T extends PointOnImage> extends Point {
  linkedPoints: T[];
}

export interface RealPoint extends Point {
  x: number;
  y: number;
  z: number;
}
