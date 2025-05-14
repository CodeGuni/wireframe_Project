import { Context } from "konva/lib/Context";
import { Point } from "../../../types";
import { IShapeData, ShapeStyle } from "../../../types/shape";
import { IRenderStrategy } from "../../strategies/render/IRenderStrategy";
import { ISelectionStrategy } from "../../strategies/selection/ISelectionStrategy";
import { IShape } from "./IShape";
import { ConnectionPoint } from "../../../types/connection";

/**
 * Abstract base class representing a shape in the floor plan.
 * Implements common functionality for all shapes including rendering, selection, and state management.
 *
 * @typeParam T - Type extending IShapeData that defines the shape's properties
 *
 * @remarks
 * BaseShape provides core functionality for:
 * - Shape rendering through a render strategy
 * - Selection handling through a selection strategy
 * - State management (capture/restore)
 * - Position and style management
 * - Handle management for shape manipulation
 * - Z-index management for layering
 * - Hover and selection state
 *
 * @example
 * ```typescript
 * class Rectangle extends BaseShape<RectangleData> {
 *   constructor(properties: RectangleData) {
 *     super(properties, new RectangleRenderStrategy(), new RectangleSelectionStrategy());
 *   }
 * }
 * ```
 */
export abstract class BaseShape<T extends IShapeData> implements IShape {
  protected static readonly DEFAULT_HANDLE_SIZE = 5;
  protected oldProperties!: T;
  protected properties!: T;

  protected zIndex: number = 0;
  protected isSelected: boolean;
  protected isHovered: boolean;
  protected renderStrategy: IRenderStrategy;
  protected selectionStrategy: ISelectionStrategy;

  protected connectionPoints: ConnectionPoint[] = [];

  constructor(
    properties: T,
    renderStrategy: IRenderStrategy,
    selectionStrategy: ISelectionStrategy
  ) {
    this.isSelected = false;
    this.isHovered = false;
    this.renderStrategy = renderStrategy;
    this.selectionStrategy = selectionStrategy;
    this.properties = properties;
    this.captureState();
    this.updateConnectionPoints();
  }

  getConnectionPoints(): ConnectionPoint[] {
    return this.connectionPoints;
  }

  protected initializeConnectionPoints(): void {
    const bounds = this.getBounds();
    if (!bounds) return;

    const { start, end } = bounds;
    const center = this.getPosition();

    // Create default connection points at the middle of each side
    this.connectionPoints = [
      // Top
      {
        id: `${this.properties.id}-top`,
        position: { x: center.x, y: start.y },
        type: "bidirectional",
        parentId: this.properties.id,
      },
      // Right
      {
        id: `${this.properties.id}-right`,
        position: { x: end.x, y: center.y },
        type: "bidirectional",
        parentId: this.properties.id,
      },
      // Bottom
      {
        id: `${this.properties.id}-bottom`,
        position: { x: center.x, y: end.y },
        type: "bidirectional",
        parentId: this.properties.id,
      },
      // Left
      {
        id: `${this.properties.id}-left`,
        position: { x: start.x, y: center.y },
        type: "bidirectional",
        parentId: this.properties.id,
      },
    ];
  }
  // Add this to update connection points when shape moves
  updateConnectionPoints(): void {
    this.initializeConnectionPoints();
  }

  abstract moveTo(dragginStartPoint: Point, position: Point): void;
  abstract getHandlePositionByIndex(handleIndex: number): Point;
  abstract updateHandle(handleIndex: number, pointer: Point): unknown;
  abstract getBounds(): { start: Point; end: Point } | null;
  abstract getType(): string;
  abstract getHandles(): Point[];

  getProperties(): T {
    return this.properties;
  }

  getOldProperties(): T {
    return this.oldProperties;
  }

  captureState(): void {
    this.oldProperties = JSON.parse(JSON.stringify(this.properties));
    this.updateConnectionPoints();
  }

  restoreState(oldState: T): void {
    this.properties = JSON.parse(JSON.stringify(oldState));
  }

  setHovered(arg0: boolean): void {
    this.isHovered = arg0;
  }

  getIsHovered(): boolean {
    return this.isHovered;
  }

  render(context: Context): void {
    this.renderStrategy.render(context, this);
  }

  getPosition(): Point {
    return this.properties.position;
  }

  getStyle(): ShapeStyle {
    return this.properties.style;
  }

  setPosition(position: Point): void {
    this.properties.position = position;
  }

  setStyle(style: ShapeStyle): void {
    this.properties.style = style;
  }

  setSelected(selected: boolean): void {
    this.isSelected = selected;
  }

  getIsSelected(): boolean {
    return this.isSelected;
  }

  isPointInside(point: Point): boolean {
    return this.selectionStrategy.isSelected(point, this);
  }

  /**
   * Returns the index of the handle at the given point, or null if no handle is found.
   *
   * @param point - The point to check for handle intersection
   * @returns The index of the handle if found, null otherwise
   *
   * @remarks
   * This method checks each handle of the shape to see if the given point
   * falls within the circular area of the handle, using the handle size
   * specified in properties or the default handle size.
   */
  getHandleAtPoint(point: Point): number | null {
    const handles = this.getHandles();
    const handleSize =
      this.properties.handleProperties?.size ?? BaseShape.DEFAULT_HANDLE_SIZE;

    for (let i = 0; i < handles.length; i++) {
      if (this.isPointInCircle(point, handles[i], handleSize)) {
        return i;
      }
    }
    return null;
  }

  /**
   * Determines if a point lies within or on the boundary of a circle.
   * Uses the circle equation (x - h)² + (y - k)² = r², where (h,k) is the center.
   *
   * @param point - The point to check, containing x and y coordinates
   * @param center - The center point of the circle, containing x and y coordinates
   * @param radius - The radius of the circle
   * @returns True if the point is inside or on the circle, false otherwise
   */
  isPointInCircle(point: Point, center: Point, radius: number): boolean {
    const dx = point.x - center.x;
    const dy = point.y - center.y;

    return dx * dx + dy * dy <= radius * radius;
  }

  bringToFront(): void {
    this.zIndex = Date.now(); // Use timestamp as z-index
  }

  getZIndex(): number {
    return this.zIndex;
  }

  setZIndex(arg0: number) {
    this.zIndex = arg0;
  }
}
