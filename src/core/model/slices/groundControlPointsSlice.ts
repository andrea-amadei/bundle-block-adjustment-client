import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';import { PointOnImage, RealPoint, ImagesLinkedPoint } from './common/interfaces';import type { RootState } from '../store';import {  addLinkedPointCommon, addPointBase,  addPointCommon, getIdForNewPoint,  removeLinkedPointCommon,  removePointCommon,  setLinkedPointXCommon,  setLinkedPointYCommon,  setXByPointIdCommon,  setYByPointIdCommon,  setZByPointIdCommon} from "./common/reducers";import { gcpTest } from './ModelTestData';import { TiePoint, TiePointMap } from "./tiePointsSlice";export type PointOnImageGCP = { source: 'MANUAL' | 'IMPORTED' } & PointOnImage;export type GroundControlPoint = ImagesLinkedPoint<PointOnImageGCP> & RealPoint;export interface GroundControlPointMap {  [id: number]: GroundControlPoint}export const groundControlPointsSlice = createSlice({  name: 'groundControlPoints',  initialState: gcpTest as GroundControlPointMap,  reducers: {    addPoint: (      state: GroundControlPointMap,      action: PayloadAction<GroundControlPoint>    ) => addPointCommon(state, action),    addNewPointWithLinkedImage: (state: GroundControlPointMap, action: PayloadAction<number>) => {      const imageId = action.payload;      const newPointId = getIdForNewPoint(state);      const newPoint: GroundControlPoint = {        pointId: newPointId,        x: 1,        y: 1,        z: 1,        linkedImages: {          [imageId]: {            imageId,            x: 1,            y: 1,            source: "MANUAL",            pointId: newPointId          }        }      };      addPointBase(state, newPoint);    },    removePointByPointId: (      state: GroundControlPointMap,      action: PayloadAction<number>    ) => removePointCommon(state, action),    addLinkedPointByPointId: (      state: GroundControlPointMap,      action: PayloadAction<PointOnImageGCP>    ) => addLinkedPointCommon(state, action),    removeLinkedPointByPointId: {      prepare: (pointId: number, imageId: number) => ({        payload: { pointId, imageId },      }),      reducer: (        state: GroundControlPointMap,        action: PayloadAction<{ pointId: number; imageId: number }>      ) => removeLinkedPointCommon(state, action),    },    setLinkedPointX: {      prepare: (pointId: number, imageId: number, x: number) => ({        payload: { pointId, imageId, x },      }),      reducer: (        state: GroundControlPointMap,        action: PayloadAction<{ pointId: number; imageId: number; x: number }>      ) => setLinkedPointXCommon(state, action),    },    setLinkedPointY: {      prepare: (pointId: number, imageId: number, y: number) => ({        payload: { pointId, imageId, y },      }),      reducer: (        state: GroundControlPointMap,        action: PayloadAction<{ pointId: number; imageId: number; y: number }>      ) => setLinkedPointYCommon(state, action),    },    setXByPointId: {      prepare: (pointId: number, x: number) => ({ payload: { pointId, x } }),      reducer: (        state: GroundControlPointMap,        action: PayloadAction<{ pointId: number; x: number }>      ) => setXByPointIdCommon(state, action),    },    setYByPointId: {      prepare: (pointId: number, y: number) => ({ payload: { pointId, y } }),      reducer: (        state: GroundControlPointMap,        action: PayloadAction<{ pointId: number; y: number }>      ) => setYByPointIdCommon(state, action),    },    setZByPointId: {      prepare: (pointId: number, z: number) => ({ payload: { pointId, z } }),      reducer: (        state: GroundControlPointMap,        action: PayloadAction<{ pointId: number; z: number }>      ) => setZByPointIdCommon(state, action),    },  },});export const {  addPoint,  addNewPointWithLinkedImage,  removePointByPointId,  addLinkedPointByPointId,  removeLinkedPointByPointId,  setLinkedPointX,  setLinkedPointY,  setXByPointId,  setYByPointId,  setZByPointId,} = groundControlPointsSlice.actions;export const selectGroundControlPoints = (state: RootState) =>  state.groundControlPoints as GroundControlPointMap;export const selectGroundControlPointList = (state: RootState) =>  Object.values(state.groundControlPoints) as GroundControlPoint[];export const selectGroundControlPointById =  (id: number) => (state: RootState) =>    state.groundControlPoints[id] as GroundControlPoint;export const selectLinkedImagesListForGroundControlPoint = (id: number) => (state: RootState) =>  Object.values(state.groundControlPoints[id].linkedImages) as PointOnImage[];const _selectImageId = (_state: RootState, {imageId}: {imageId: number | undefined}) => imageId;const _selectGroundControlPointsOnImage = createSelector(  [selectGroundControlPointList, _selectImageId],  (points, imageId) =>    points      .filter(point => imageId !== undefined && imageId in point.linkedImages)      .map(point => point.linkedImages[imageId as number]));export const selectGroundControlPointsOnImage =  (imageId: number | undefined) => (state: RootState) =>    _selectGroundControlPointsOnImage(state, { imageId }) as PointOnImage[];const _selectPointSourceType = (_state: RootState, {pointSourceType}: {pointSourceType: string | undefined}) => pointSourceType;const _selectGroundControlPointsOnImageBySourceType = createSelector(  [_selectGroundControlPointsOnImage, _selectPointSourceType],  (tpOnImageList, source) => tpOnImageList    .filter((tp) => tp.source === source));export const selectGroundControlPointsOnImageBySourceType =  (imageId: number | undefined, pointSourceType: string | undefined) =>  (state: RootState) =>    _selectGroundControlPointsOnImageBySourceType(state, { imageId, pointSourceType }) as PointOnImage[];const _selectPointId = (_state: RootState, {pointId}: {pointId: number | undefined}) => pointId;const _selectGroundControlPointsPointOnImageById = createSelector(  [selectGroundControlPoints, _selectPointId, _selectImageId],  (gcpMap, pointId, imageId) => {    if(pointId !== undefined && imageId !== undefined)      return gcpMap[pointId].linkedImages[imageId] as PointOnImage;    return undefined;  });export const selectGroundControlPointsOnImageById = (pointId: number | undefined, imageId: number | undefined) => (state: RootState) =>  _selectGroundControlPointsPointOnImageById(state, {pointId, imageId}) as PointOnImage;export default groundControlPointsSlice.reducer;