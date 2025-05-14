import { IShape } from "../shapes/base/IShape";

export enum ShapeEventType {
  ADDED = "SHAPE_ADDED",
  UPDATED = "SHAPE_UPDATED",
  REMOVED = "SHAPE_REMOVED",
  SELECTED = "SHAPE_SELECTED",
  DESELECTED = "SHAPE_DESELECTED",
}

export interface ShapeEvent {
  type: ShapeEventType;
  shapeId: string;
  shape: IShape;
  payload?: any;
}
