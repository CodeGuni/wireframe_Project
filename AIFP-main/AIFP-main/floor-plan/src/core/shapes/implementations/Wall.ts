import { Point } from "../../../types";
import { WallData } from "../../../types/shape";
import { getCenterPoint } from "../../../utils/coordinates";
import { WallRenderStrategy } from "../../strategies/render/WallRenderStrategy";
import { WallSelectionStrategy } from "../../strategies/selection/WallSelectionStrategy";
import { BaseShape } from "../base/BaseShape";

export class Wall extends BaseShape<WallData> {
  constructor(properties: WallData) {
    super(properties, new WallRenderStrategy(), new WallSelectionStrategy());
  }

  getHandlePositionByIndex(handleIndex: number): Point {
    if (handleIndex === 0) {
      return this.properties.geometry.start;
    } else if (handleIndex === 1) {
      return this.properties.geometry.end;
    }
    throw new Error(`Invalid handle index ${handleIndex}`);
  }

  getBounds(): { start: Point; end: Point } | null {
    // Extract coordinates
    const { x: x1, y: y1 } = this.properties.geometry.start;
    const { x: x2, y: y2 } = this.properties.geometry.end;

    // Compute min/max
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    // Return bounding rectangle
    return {
      start: { x: minX, y: minY },
      end: { x: maxX, y: maxY },
    };
  }

  getType(): string {
    return "wall";
  }

  getStart(): Point {
    return this.properties.geometry.start;
  }

  getEnd(): Point {
    return this.properties.geometry.end;
  }

  getThickness(): number {
    return this.properties.thickness;
  }

  setStart(start: Point): void {
    this.properties.geometry.start = start;
  }

  setEnd(end: Point): void {
    this.properties.geometry.end = end;
  }

  setThickness(thickness: number): void {
    this.properties.thickness = thickness;
  }

  moveTo(startPoint: Point, position: Point): void {
    const dx = position.x - startPoint.x;
    const dy = position.y - startPoint.y;

    this.properties.geometry.start = {
      x: this.oldProperties.geometry.start.x + dx,
      y: this.oldProperties.geometry.start.y + dy,
    };

    this.properties.geometry.end = {
      x: this.oldProperties.geometry.end.x + dx,
      y: this.oldProperties.geometry.end.y + dy,
    };

    this.properties.position = getCenterPoint(
      this.properties.geometry.start,
      this.properties.geometry.end
    );
  }

  getHandles(): Point[] {
    return [this.properties.geometry.start, this.properties.geometry.end];
  }

  updateHandle(handleIndex: number, pointer: Point): void {
    if (handleIndex === 0) {
      this.properties.geometry.start = pointer;
    } else if (handleIndex === 1) {
      this.properties.geometry.end = pointer;
    }
    this.properties.position = getCenterPoint(
      this.properties.geometry.start,
      this.properties.geometry.end
    );
  }

  protected bringShapeToFront(): void {
    super.bringToFront();
    this.captureState();
  }
}
