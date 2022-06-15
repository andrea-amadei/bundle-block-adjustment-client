import { AnyAction, createAction, createSelector, createSlice, Middleware, PayloadAction } from "@reduxjs/toolkit";import { PointOnImage, ImagesLinkedPoint } from './common/interfaces';import { RootState } from '../store';import {  addLinkedPointCommon,  addPointCommon, editPointCommon, getIdForNewPoint, removeAllLinkedPointsByImageIdCommon,  removeLinkedPointCommon,  removePointCommon,  setLinkedPointXCommon,  setLinkedPointYCommon} from './common/reducers';import { tpTest } from "./ModelTestData";export type TiePoint = ImagesLinkedPoint<PointOnImage>;export interface TiePointMap {  [id: number]: TiePoint}export const tiePointsSlice = createSlice({  name: 'tiePoints',  initialState: tpTest as TiePointMap,  reducers: {    addPoint: (state: TiePointMap, action: PayloadAction<TiePoint>) =>      addPointCommon(state, action),    editPoint: (state: TiePointMap, action: PayloadAction<TiePoint>) =>      editPointCommon(state, action),    removePointByPointId: (state: TiePointMap, action: PayloadAction<number>) =>      removePointCommon(state, action),    addLinkedPointByPointId: (      state: TiePointMap,      action: PayloadAction<PointOnImage>    ) => addLinkedPointCommon(state, action),    removeLinkedPointByPointId: {      prepare: (pointId: number, imageId: number) => ({        payload: { pointId, imageId },      }),      reducer: (        state: TiePointMap,        action: PayloadAction<{ pointId: number; imageId: number }>      ) => removeLinkedPointCommon(state, action),    },    removeAllLinkedPointsByImageId: (state: TiePointMap, action: PayloadAction<number>) =>      removeAllLinkedPointsByImageIdCommon(state, action),    removeAll: (state: TiePointMap) => {      Object.keys(state).forEach((k) => delete state[parseInt(k, 10)]);    },    setLinkedPointX: {      prepare: (pointId: number, imageId: number, x: number) => ({        payload: { pointId, imageId, x },      }),      reducer: (        state: TiePointMap,        action: PayloadAction<{ pointId: number; imageId: number; x: number }>      ) => setLinkedPointXCommon(state, action),    },    setLinkedPointY: {      prepare: (pointId: number, imageId: number, y: number) => ({        payload: { pointId, imageId, y },      }),      reducer: (        state: TiePointMap,        action: PayloadAction<{ pointId: number; imageId: number; y: number }>      ) => setLinkedPointYCommon(state, action),    },  },});export const {  addPoint,  editPoint,  removePointByPointId,  addLinkedPointByPointId,  removeAllLinkedPointsByImageId,  removeAll,  removeLinkedPointByPointId,  setLinkedPointX,  setLinkedPointY,} = tiePointsSlice.actions;export const addNewDefaultPointWithLinkedImage = createAction<number>('tiePoints/addNewDefaultPointWithLinkedImage');export const selectTiePoints = (state: RootState) =>  state.tiePoints as TiePointMap;export const selectTiePointList = (state: RootState) =>  Object.values(state.tiePoints) as TiePoint[];export const selectTiePointById = (id: number) => (state: RootState) =>  state.tiePoints[id] as TiePoint;export const selectLinkedImagesListForTiePoint = (id: number) => (state: RootState) => {  if (id !== undefined && state.tiePoints[id])    return Object.values(state.tiePoints[id].linkedImages) as PointOnImage[];  return undefined;};const _selectImageId = (_state: RootState, {imageId}: {imageId: number | undefined}) => imageId;const _selectTiePointsOnImage = createSelector(  [selectTiePointList, _selectImageId],  (points, imageId) => points    .filter(point => imageId !== undefined && imageId in point.linkedImages)    .map(point => point.linkedImages[imageId as number]));export const selectTiePointsOnImage = (imageId: number | undefined) => (state: RootState) =>  _selectTiePointsOnImage(state, {imageId}) as PointOnImage[];const _selectPointSourceType = (_state: RootState, {pointSourceType}: {pointSourceType: string | undefined}) => pointSourceType;const _selectTiePointsOnImageBySourceType = createSelector(  [_selectTiePointsOnImage, _selectPointSourceType],  (tpOnImageList, source) => tpOnImageList    .filter(tp => tp.source === source));export const selectTiePointsOnImageBySourceType = (imageId: number | undefined, pointSourceType: string | undefined) => (state: RootState) =>  _selectTiePointsOnImageBySourceType(state, {imageId, pointSourceType}) as PointOnImage[];const _selectPointId = (_state: RootState, {pointId}: {pointId: number | undefined}) => pointId;const _selectTiePointOnImageById = createSelector(  [selectTiePoints, _selectPointId, _selectImageId],  (tpMap, pointId, imageId) => {    if(pointId !== undefined && imageId !== undefined && tpMap[pointId])      return tpMap[pointId].linkedImages[imageId] as PointOnImage;    return undefined;  });export const selectTiePointOnImageById = (pointId: number | undefined, imageId: number | undefined) => (state: RootState) =>  _selectTiePointOnImageById(state, {pointId, imageId}) as PointOnImage;export const populateNewTPWithDefaultsMiddleware: Middleware<{}, RootState> = storeAPI => next => (action: AnyAction) => {  if (addNewDefaultPointWithLinkedImage.match(action)) {    const imageId = action.payload;    const state = storeAPI.getState();    const newPointId = getIdForNewPoint(state.tiePoints);    const image = state.imageList[imageId];    const newTP: TiePoint = {      pointId: newPointId,      linkedImages: {        [imageId]: {          imageId,          pointId: newPointId,          x: Math.round(image.width/2),          y: Math.round(image.height/2),          source: "MANUAL"        }      }    }    return next(addPoint(newTP));  }  return next(action);}export default tiePointsSlice.reducer;