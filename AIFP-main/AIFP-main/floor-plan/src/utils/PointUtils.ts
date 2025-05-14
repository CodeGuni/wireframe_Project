import { Point } from "../types";

export class PointUtils {
  // Create a Point
  static createPoint(x: number, y: number): Point {
    return { x, y };
  }

  static getCenter(points: Point[]): Point {
    let x = 0;
    let y = 0;
    points.forEach((point) => {
      x += point.x;
      y += point.y;
    });
    return { x: x / points.length, y: y / points.length };
  }

  // Calculate distance between two points
  static distanceBetweenPoints(p1: Point, p2: Point): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  // Translate a point
  static translatePoint(p: Point, dx: number, dy: number): Point {
    return { x: p.x + dx, y: p.y + dy };
  }

  // Check equality between two points
  static arePointsEqual(p1: Point, p2: Point): boolean {
    return p1.x === p2.x && p1.y === p2.y;
  }

  // Rotate a point around an origin
  static rotatePoint(
    p: Point,
    angle: number,
    origin: Point = { x: 0, y: 0 }
  ): Point {
    const rad = (angle * Math.PI) / 180; // Convert angle to radians
    const translatedX = p.x - origin.x;
    const translatedY = p.y - origin.y;

    const rotatedX = translatedX * Math.cos(rad) - translatedY * Math.sin(rad);
    const rotatedY = translatedX * Math.sin(rad) + translatedY * Math.cos(rad);

    return { x: rotatedX + origin.x, y: rotatedY + origin.y };
  }

  // Find the midpoint between two points
  static midpointBetweenPoints(p1: Point, p2: Point): Point {
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  }

  /**
   * Calculates the unit vector in the direction from pointA to pointB.
   * @param pointA - The starting point coordinates
   * @param pointB - The ending point coordinates
   * @returns A normalized vector (point) representing the direction from A to B.
   * If points are identical, returns a zero vector {x: 0, y: 0}
   */
  static direction(pointA: Point, pointB: Point): Point {
    const dx = pointB.x - pointA.x;
    const dy = pointB.y - pointA.y;
    const magnitude = Math.sqrt(dx * dx + dy * dy);

    // If the points are the same, return a zero vector
    if (magnitude === 0) {
      return { x: 0, y: 0 };
    }

    return { x: dx / magnitude, y: dy / magnitude };
  }

  static translateInDirection(
    pointA: Point,
    direction: Point,
    distance: number
  ): Point {
    return {
      x: pointA.x + direction.x * distance,
      y: pointA.y + direction.y * distance,
    };
  }

  static add(p1: Point, p2: Point): Point {
    return {
      x: p1.x + p2.x,
      y: p1.y + p2.y,
    };
  }

  static divide(point: Point, scalar: number): Point {
    return {
      x: point.x / scalar,
      y: point.y / scalar,
    };
  }

  static center(p1: Point, p2: Point): Point {
    return this.divide(this.add(p1, p2), 2);
  }
}
