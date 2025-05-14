import { Point } from ".";

export type WallGeometry = LineGeometry;

export type Geometry =
  | LineGeometry
  | ArcGeometry
  | CircleGeometry
  | RectangularGeometry
  | PolygonGeometry;

export interface LineGeometry {
  start: Point;
  end: Point;
}

export interface ArcGeometry {
  start: Point;
  end: Point;
  center: Point;
  radius: number;
}

export interface CircleGeometry {
  center: Point;
  radius: number;
}

export interface RectangularGeometry {
  topLeft: Point;
  bottomRight: Point;
}

export interface PolygonGeometry {
  vertices: Point[];
}
