import { AnyAction, Middleware } from "@reduxjs/toolkit";import { RootState } from "./store";import {  addPoint as addPointTP,  addLinkedPointByPointId as addLinkedPointByPointIdTP,  setLinkedPointX as setLinkedPointXTP,  setLinkedPointY as setLinkedPointYTP,} from "./slices/tiePointsSlice";import {  addPoint as addPointGCP,  addLinkedPointByPointId as addLinkedPointByPointIdGCP,  setLinkedPointX as setLinkedPointXGCP,  setLinkedPointY as setLinkedPointYGCP,} from "./slices/groundControlPointsSlice";function limit(val: number, min:number, max:number) {  if(val < min)    return min;  if(val > max)    return max;  return val;}export const pointPositionOnImageBoundedMiddleware: Middleware<{}, RootState> = storeAPI => next => (action: AnyAction) => {  const images = storeAPI.getState().imageList;  const newAction = {...action};  if('payload' in newAction)    newAction.payload = {...newAction.payload};  if (addPointTP.match(newAction) || addPointGCP.match(newAction)) {    newAction.payload.linkedImages = {...newAction.payload.linkedImages};    Object.keys(newAction.payload.linkedImages).forEach(imageIdStr => {      const imageId = parseInt(imageIdStr);      const pointOnImage = {...newAction.payload.linkedImages[imageId]};      pointOnImage.x = limit(pointOnImage.x, 0, images[imageId].width - 1);      pointOnImage.y = limit(pointOnImage.y, 0, images[imageId].height - 1);      newAction.payload.linkedImages[imageId] = pointOnImage;      });    return next(newAction);  }  if (addLinkedPointByPointIdTP.match(newAction) || addLinkedPointByPointIdGCP.match(newAction)) {    const pointOnImage = newAction.payload;    pointOnImage.x = limit(pointOnImage.x, 0, images[pointOnImage.imageId].width - 1);    pointOnImage.y = limit(pointOnImage.y, 0, images[pointOnImage.imageId].height - 1);    return next(newAction);  }  if (setLinkedPointXTP.match(newAction) || setLinkedPointXGCP.match(newAction)) {    const {imageId} = newAction.payload;    newAction.payload.x = limit(newAction.payload.x, 0, images[imageId].width - 1);    return next(newAction);  }  if (setLinkedPointYTP.match(newAction) || setLinkedPointYGCP.match(newAction)) {    const {imageId} = newAction.payload;    newAction.payload.y = limit(newAction.payload.y, 0, images[imageId].height - 1);    return next(newAction);  }  return next(action);}