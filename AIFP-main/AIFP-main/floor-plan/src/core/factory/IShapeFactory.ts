import { IShape } from "../shapes/base/IShape";
import { IShapeData } from "../../types/shape";

export type ShapeCreator<T extends IShapeData> = (config: T) => IShape;

export interface IShapeFactory {
  createShape<T extends IShapeData>(type: string, config: T): IShape;
  registerShape<T extends IShapeData>(
    type: string,
    creator: ShapeCreator<T>
  ): void;
  hasShape(type: string): boolean;
}
