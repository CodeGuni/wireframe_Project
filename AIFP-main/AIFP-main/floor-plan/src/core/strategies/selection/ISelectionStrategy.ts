import { Point } from "../../../types";
import { IShape } from "../../shapes/base/IShape";

export interface ISelectionStrategy {
  isSelected(point: Point, shape: IShape): boolean;
}
