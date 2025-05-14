import { Point } from ".";
import { IShapeData } from "./shape";

// types/connection.ts
export interface ConnectionPoint {
  id: string;
  position: Point;
  type: "input" | "output" | "bidirectional";
  parentId: string | undefined; // ID of the shape this point belongs to
}

export interface ConnectorData extends IShapeData {
  sourcePoint: ConnectionPoint;
  targetPoint: ConnectionPoint;
  type: "straight" | "curved";
  controlPoints?: Point[]; // For curved lines
}
