import { Context } from "konva/lib/Context";
import { Point } from "../../../types";
import { IShapeData, ShapeStyle } from "../../../types/shape";

export interface IShape {
  // Core shape operations
  render(context: Context): void;
  moveTo(dragStartPoint: Point, position: Point): void;
  getBounds(): { start: Point; end: Point } | null;
  
  // State management
  captureState(): void;
  restoreState(state: IShapeData): void;
  getProperties(): IShapeData;
  getOldProperties(): IShapeData;
  
  // Handle management
  getHandles(): Point[];
  getHandleAtPoint(point: Point): number | null;
  getHandlePositionByIndex(handleIndex: number): Point;
  updateHandle(handleIndex: number, pointer: Point): void;
  
  // Position and style
  getPosition(): Point;
  setPosition(position: Point): void;
  getStyle(): ShapeStyle;
  setStyle(style: ShapeStyle): void;
  
  // Selection and hover states
  isPointInside(point: Point): boolean;
  setSelected(selected: boolean): void;
  getIsSelected(): boolean;
  setHovered(isHovered: boolean): void;
  getIsHovered(): boolean;
  
  // Z-index management
  getZIndex(): number;
  setZIndex(zIndex: number): void;
  bringToFront(): void;
  
  // Type information
  getType(): string;
}