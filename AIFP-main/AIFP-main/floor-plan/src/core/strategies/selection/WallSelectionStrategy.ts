import { Point } from "../../../types";
import { Wall } from "../../shapes/implementations/Wall";
import { ISelectionStrategy } from "./ISelectionStrategy";

export class WallSelectionStrategy implements ISelectionStrategy {
  isSelected(point: Point, shape: Wall): boolean {
    const start = shape.getStart();
    const end = shape.getEnd();
    const thickness = shape.getThickness();
    const handleProperties = shape.getProperties().handleProperties;

    const handles: Point[] = [start, end];
    const isHandleSelected = handles.some((handle) =>
      this.isPointInCircle(point, handle, handleProperties?.size || 5)
    );

    if (isHandleSelected) return true;

    // Calculate wall bounds
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) return false;

    // Calculate perpendicular distance from point to wall line
    const perpDistance = Math.abs(
      (dy * point.x - dx * point.y + end.x * start.y - end.y * start.x) / length
    );

    // Calculate if point is within wall length
    const dotProduct = (point.x - start.x) * dx + (point.y - start.y) * dy;
    const isWithinLength = dotProduct >= 0 && dotProduct <= length * length;

    // Check if point is within wall thickness and length
    // console.log(perpDistance <= thickness / 2 && isWithinLength);
    return perpDistance <= thickness / 2 && isWithinLength;
  }

  getHandleAtPoint(point: Point, shape: Wall): number | null {
    const start = shape.getStart();
    const end = shape.getEnd();
    const handleRadius = 5;

    // Check start handle
    if (this.isPointInCircle(point, start, handleRadius)) {
      return 0;
    }

    // Check end handle
    if (this.isPointInCircle(point, end, handleRadius)) {
      return 1;
    }

    return null;
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
