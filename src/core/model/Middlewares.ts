import { AnyAction, Middleware, PayloadAction } from "@reduxjs/toolkit";import { RootState } from "./store";import {  addPoint as addPointTP,  addLinkedPointByPointId as addLinkedPointByPointIdTP,  editPoint as editPointTP,  setLinkedPointX as setLinkedPointXTP,  setLinkedPointY as setLinkedPointYTP,} from "./slices/tiePointsSlice";import {  addPoint as addPointGCP,  addLinkedPointByPointId as addLinkedPointByPointIdGCP,  editPoint as editPointGCP,  setLinkedPointX as setLinkedPointXGCP,  setLinkedPointY as setLinkedPointYGCP, setXByPointId, setYByPointId, setZByPointId} from "./slices/groundControlPointsSlice";import { BaseActionCreator } from "@reduxjs/toolkit/dist/createAction";import { Action } from "redux";function limit(val: number, min:number, max:number) {  if(val < min)    return min;  if(val > max)    return max;  return val;}function isActionOneOf<B extends BaseActionCreator<any, any>>(action: Action<unknown>, actionList: B[]): action is B extends BaseActionCreator<infer P, infer T> ? PayloadAction<P, T> : unknown {  return actionList.some(a => a.match(action));}export const pointPositionOnImageBoundedMiddleware: Middleware<{}, RootState> = storeAPI => next => (action: AnyAction) => {  const images = storeAPI.getState().imageList;  const newAction = {...action};  if('payload' in newAction)    newAction.payload = {...newAction.payload};  if (isActionOneOf(newAction, [addPointTP, addPointGCP, editPointTP, editPointGCP])) {    newAction.payload.linkedImages = {...newAction.payload.linkedImages};    Object.keys(newAction.payload.linkedImages).forEach(imageIdStr => {      const imageId = parseInt(imageIdStr, 10);      const pointOnImage = {...newAction.payload.linkedImages[imageId]};      pointOnImage.x = limit(pointOnImage.x, 1, images[imageId].width);      pointOnImage.y = limit(pointOnImage.y, 1, images[imageId].height);      newAction.payload.linkedImages[imageId] = pointOnImage;      });    return next(newAction);  }  if (isActionOneOf(newAction, [addLinkedPointByPointIdTP, addLinkedPointByPointIdGCP])) {    const pointOnImage = newAction.payload;    pointOnImage.x = limit(pointOnImage.x, 1, images[pointOnImage.imageId].width);    pointOnImage.y = limit(pointOnImage.y, 1, images[pointOnImage.imageId].height);    return next(newAction);  }  if (isActionOneOf(newAction, [setLinkedPointXTP, setLinkedPointXGCP])) {    if(Number.isNaN(newAction.payload.x))      return next({type: "NONE"});    const {imageId} = newAction.payload;    newAction.payload.x = limit(newAction.payload.x, 1, images[imageId].width);    return next(newAction);  }  if (isActionOneOf(newAction, [setLinkedPointYTP, setLinkedPointYGCP])) {    if(Number.isNaN(newAction.payload.y))      return next({type: "NONE"});    const {imageId} = newAction.payload;    newAction.payload.y = limit(newAction.payload.y, 1, images[imageId].height);    return next(newAction);  }  if (isActionOneOf(newAction, [setXByPointId])) {    if (Number.isNaN(newAction.payload.x))      return next({ type: "NONE" });  }  if (isActionOneOf(newAction, [setYByPointId])) {    if (Number.isNaN(newAction.payload.y))      return next({ type: "NONE" });  }  if (isActionOneOf(newAction, [setZByPointId])) {    if (Number.isNaN(newAction.payload.z))      return next({ type: "NONE" });  }  return next(action);}