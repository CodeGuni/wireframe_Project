import { Point } from "../../../types";
import { IShape } from "../../shapes/base/IShape";
import { Connector } from "../../shapes/implementations/Connector";
import { ISelectionStrategy } from "./ISelectionStrategy";

// strategies/selection/ConnectorSelectionStrategy.ts
export class ConnectorSelectionStrategy implements ISelectionStrategy {
  isSelected(point: Point, shape: IShape): boolean {
      throw new Error("Method not implemented.");
  }
  isPointInside(point: Point, shape: Connector): boolean {
    const { sourcePoint, targetPoint, type, controlPoints } = shape.getProperties();
    const threshold = 5; // Distance threshold for selection

    if (type === "straight") {
      return this.isPointNearLine(
        point,
        sourcePoint.position,
        targetPoint.position,
        threshold
      );
    } else if (controlPoints && controlPoints.length > 0) {
      // For curved lines, check distance to quadratic curve
      return this.isPointNearQuadraticCurve(
        point,
        sourcePoint.position,
        controlPoints[0],
        targetPoint.position,
        threshold
      );
    }

    return false;
  }

  private isPointNearLine(
    point: Point,
    start: Point,
    end: Point,
    threshold: number
  ): boolean {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) return false;

    const t = Math.max(
      0,
      Math.min(
        1,
        ((point.x - start.x) * dx + (point.y - start.y) * dy) /
          (length * length)
      )
    );
    const projectionX = start.x + t * dx;
    const projectionY = start.y + t * dy;

    const distanceSquared =
      Math.pow(point.x - projectionX, 2) + Math.pow(point.y - projectionY, 2);
    return distanceSquared <= threshold * threshold;
  }

  private isPointNearQuadraticCurve(
    point: Point,
    start: Point,
    control: Point,
    end: Point,
    threshold: number
  ): boolean {
    // Simplified check using multiple line segments
    const segments = 10;
    for (let i = 0; i < segments; i++) {
      const t1 = i / segments;
      const t2 = (i + 1) / segments;

      const p1 = this.getQuadraticPoint(start, control, end, t1);
      const p2 = this.getQuadraticPoint(start, control, end, t2);

      if (this.isPointNearLine(point, p1, p2, threshold)) {
        return true;
      }
    }
    return false;
  }

  private getQuadraticPoint(
    start: Point,
    control: Point,
    end: Point,
    t: number
  ): Point {
    const x =
      Math.pow(1 - t, 2) * start.x +
      2 * (1 - t) * t * control.x +
      Math.pow(t, 2) * end.x;
    const y =
      Math.pow(1 - t, 2) * start.y +
      2 * (1 - t) * t * control.y +
      Math.pow(t, 2) * end.y;
    return { x, y };
  }
}
