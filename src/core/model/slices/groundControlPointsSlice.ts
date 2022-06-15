import { AnyAction, createAction, createSelector, createSlice, Middleware, PayloadAction } from "@reduxjs/toolkit";import { PointOnImage, RealPoint, ImagesLinkedPoint } from './common/interfaces';import type { RootState } from '../store';import {  addLinkedPointCommon,  addPointCommon, editPointCommon, getIdForNewPoint, removeAllLinkedPointsByImageIdCommon,  removeLinkedPointCommon,  removePointCommon,  setLinkedPointXCommon,  setLinkedPointYCommon,  setXByPointIdCommon,  setYByPointIdCommon,  setZByPointIdCommon} from './common/reducers';import { gcpTest } from './ModelTestData';export type PointOnImageGCP = { source: 'MANUAL' | 'IMPORTED' } & PointOnImage;export type GroundControlPoint = ImagesLinkedPoint<PointOnImageGCP> & RealPoint;export interface GroundControlPointMap {  [id: number]: GroundControlPoint}export const groundControlPointsSlice = createSlice({  name: 'groundControlPoints',  initialState: gcpTest as GroundControlPointMap,  reducers: {    addPoint: (      state: GroundControlPointMap,      action: PayloadAction<GroundControlPoint>    ) => addPointCommon(state, action),    editPoint: (state: GroundControlPointMap, action: PayloadAction<GroundControlPoint>) =>      editPointCommon(state, action),    removePointByPointId: (      state: GroundControlPointMap,      action: PayloadAction<number>    ) => removePointCommon(state, action),    addLinkedPointByPointId: (      state: GroundControlPointMap,      action: PayloadAction<PointOnImageGCP>    ) => addLinkedPointCommon(state, action),    removeAllLinkedPointsByImageId: (state: GroundControlPointMap, action: PayloadAction<number>) =>      removeAllLinkedPointsByImageIdCommon(state, action),    removeAll: (state: GroundControlPointMap) => {      Object.keys(state).forEach((k) => delete state[parseInt(k, 10)]);    },    removeLinkedPointByPointId: {      prepare: (pointId: number, imageId: number) => ({        payload: { pointId, imageId },      }),      reducer: (        state: GroundControlPointMap,        action: PayloadAction<{ pointId: number; imageId: number }>      ) => removeLinkedPointCommon(state, action),    },    setLinkedPointX: {      prepare: (pointId: number, imageId: number, x: number) => ({        payload: { pointId, imageId, x },      }),      reducer: (        state: GroundControlPointMap,        action: PayloadAction<{ pointId: number; imageId: number; x: number }>      ) => setLinkedPointXCommon(state, action),    },    setLinkedPointY: {      prepare: (pointId: number, imageId: number, y: number) => ({        payload: { pointId, imageId, y },      }),      reducer: (        state: GroundControlPointMap,        action: PayloadAction<{ pointId: number; imageId: number; y: number }>      ) => setLinkedPointYCommon(state, action),    },    setXByPointId: {      prepare: (pointId: number, x: number) => ({ payload: { pointId, x } }),      reducer: (        state: GroundControlPointMap,        action: PayloadAction<{ pointId: number; x: number }>      ) => setXByPointIdCommon(state, action),    },    setYByPointId: {      prepare: (pointId: number, y: number) => ({ payload: { pointId, y } }),      reducer: (        state: GroundControlPointMap,        action: PayloadAction<{ pointId: number; y: number }>      ) => setYByPointIdCommon(state, action),    },    setZByPointId: {      prepare: (pointId: number, z: number) => ({ payload: { pointId, z } }),      reducer: (        state: GroundControlPointMap,        action: PayloadAction<{ pointId: number; z: number }>      ) => setZByPointIdCommon(state, action),    },  },});export const {  addPoint,  editPoint,  removePointByPointId,  addLinkedPointByPointId,  removeAllLinkedPointsByImageId,  removeAll,  removeLinkedPointByPointId,  setLinkedPointX,  setLinkedPointY,  setXByPointId,  setYByPointId,  setZByPointId,} = groundControlPointsSlice.actions;export const addNewDefaultPointWithLinkedImage = createAction<number>('groundControlPoints/addNewDefaultPointWithLinkedImage');export const removeAllLinkedImages = createAction<void>('groundControlPoints/removeAllLinkedImages');export const selectGroundControlPoints = (state: RootState) =>  state.groundControlPoints as GroundControlPointMap;export const selectGroundControlPointList = (state: RootState) =>  Object.values(state.groundControlPoints) as GroundControlPoint[];export const selectGroundControlPointById =  (id: number) => (state: RootState) =>    state.groundControlPoints[id] as GroundControlPoint;export const selectLinkedImagesListForGroundControlPoint = (id: number) => (state: RootState) =>  {  if (id !== undefined && state.groundControlPoints[id])    return Object.values(state.groundControlPoints[id].linkedImages) as PointOnImage[];  return undefined;};const _selectImageId = (_state: RootState, {imageId}: {imageId: number | undefined}) => imageId;const _selectGroundControlPointsOnImage = createSelector(  [selectGroundControlPointList, _selectImageId],  (points, imageId) =>    points      .filter(point => imageId !== undefined && imageId in point.linkedImages)      .map(point => point.linkedImages[imageId as number]));export const selectGroundControlPointsOnImage =  (imageId: number | undefined) => (state: RootState) =>    _selectGroundControlPointsOnImage(state, { imageId }) as PointOnImage[];const _selectPointSourceType = (_state: RootState, {pointSourceType}: {pointSourceType: string | undefined}) => pointSourceType;const _selectGroundControlPointsOnImageBySourceType = createSelector(  [_selectGroundControlPointsOnImage, _selectPointSourceType],  (tpOnImageList, source) => tpOnImageList    .filter((tp) => tp.source === source));export const selectGroundControlPointsOnImageBySourceType =  (imageId: number | undefined, pointSourceType: string | undefined) =>  (state: RootState) =>    _selectGroundControlPointsOnImageBySourceType(state, { imageId, pointSourceType }) as PointOnImage[];const _selectPointId = (_state: RootState, {pointId}: {pointId: number | undefined}) => pointId;const _selectGroundControlPointsPointOnImageById = createSelector(  [selectGroundControlPoints, _selectPointId, _selectImageId],  (gcpMap, pointId, imageId) => {    if(pointId !== undefined && imageId !== undefined && gcpMap[pointId])      return gcpMap[pointId].linkedImages[imageId] as PointOnImage;    return undefined;  });export const selectGroundControlPointsOnImageById = (pointId: number | undefined, imageId: number | undefined) => (state: RootState) =>  _selectGroundControlPointsPointOnImageById(state, {pointId, imageId}) as PointOnImage;export const populateNewGCPWithDefaultsMiddleware: Middleware<{}, RootState> = storeAPI => next => (action: AnyAction) => {  if (addNewDefaultPointWithLinkedImage.match(action)) {    const imageId = action.payload;    const state = storeAPI.getState();    const newPointId = getIdForNewPoint(state.groundControlPoints);    const image = state.imageList[imageId];    const newGCP: GroundControlPoint = {      pointId: newPointId,      x: 0,      y: 0,      z: 0,      linkedImages: {        [imageId]: {          imageId,          pointId: newPointId,          x: Math.round(image.width/2),          y: Math.round(image.height/2),          source: "MANUAL"        }      }    }    return next(addPoint(newGCP));  }  return next(action);}export const clearAllLinkedImagesMiddleware: Middleware<{}, RootState> = storeAPI => next => (action: AnyAction) => {  if (removeAllLinkedImages.match(action)) {    selectGroundControlPointList(storeAPI.getState())      .forEach((i) => Object.keys(i.linkedImages)        .forEach(k => next(removeLinkedPointByPointId(i.pointId, parseInt(k, 10)))));  }  return next(action);}export default groundControlPointsSlice.reducer;