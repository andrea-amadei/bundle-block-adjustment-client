export interface PointOnImage {
  pointId: number;
  imageId: number;
  x: number;
  y: number;
  source: 'AUTO' | 'MANUAL' | 'IMPORTED';
}

export interface CommonPoint<T extends PointOnImage> {
  pointId: number;
  linkedImages: T[];
}
