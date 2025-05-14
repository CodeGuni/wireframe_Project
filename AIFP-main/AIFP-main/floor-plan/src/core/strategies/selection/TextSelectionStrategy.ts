import { Point } from "../../../types";
import { ISelectionStrategy } from "./ISelectionStrategy";
import { TextShape } from "../../shapes/implementations/TextShape";

export class TextSelectionStrategy implements ISelectionStrategy {
  isSelected(point: Point, shape: TextShape): boolean {
    const bounds = shape.getBounds();
    const position = shape.getPosition();
    const width = shape.getWidth();
    const height = shape.getHeight();

    const handles: Point[] = shape.getHandles();
    const isHandleSelected = handles.some((handle) =>
      this.isPointInCircle(
        point,
        handle,
        shape.getProperties().handleProperties?.size || 5
      )
    );

    if (isHandleSelected) return true;

    return this.isPointInRectangle(point, bounds.start, width, height);
  }

  getHandleAtPoint(point: Point, shape: TextShape): number | null {
    const handleRadius = shape.getProperties().handleProperties?.size || 5;
    const handles = shape.getHandles();

    for (let i = 0; i < handles.length; i++) {
      if (this.isPointInCircle(point, handles[i], handleRadius)) {
        return i;
      }
    }

    return null;
  }

  private isPointInRectangle(
    point: Point,
    start: Point,
    width: number,
    height: number
  ): boolean {
    return (
      point.x >= start.x &&
      point.x <= start.x + width &&
      point.y >= start.y &&
      point.y <= start.y + height
    );
  }

  private isPointInCircle(
    point: Point,
    center: Point,
    radius: number
  ): boolean {
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    return dx * dx + dy * dy <= radius * radius;
  }
}
