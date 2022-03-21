export interface PointOnImage {
  pointId: number;
  imageId: number;
  x: number;
  y: number;
  source: 'AUTO' | 'MANUAL' | 'IMPORTED';
}
