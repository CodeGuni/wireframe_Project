import { BrushBase } from "./drawing";

// types.ts
export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export type ShapeType = "wall" | "text-shape";

export interface DrawingSegment {
  points: Point[];
  strokeStyle: string;
  lineWidth: number;
  isEraser?: boolean;
  timestamp?: number; // For undo/redo functionality
  id?: string; // Unique identifier for segment manipulation
}

export interface WallSegment {
  start: Point;
  end: Point;
  thickness: number;
  id?: string;
}

export interface GridConfig {
  enabled: boolean;
  color: string;
  lineWidth: number;
  unitSystem: UnitSystem;
  gridSize: number;
  showAxes?: boolean; // Option to show X/Y axes
  showLabels?: boolean; // Option to show grid measurements
  snapToGrid?: boolean; // Enable/disable grid snapping
}

export type UnitSystem = "metric" | "imperial";

export type SketchTool =
  | "line"
  | "rectangle"
  | "in-scribed-polygon"
  | "circumscribed-polygon"
  | "circle"
  | "start-end-radius-arc"
  | "center-end-arc"
  | "tangent-end-arc"
  | "fillet-arc"
  | "ellipse"
  | "partial-ellipse";

export type ObjectType =
  | "free-draw"
  | "wall"
  | "door"
  | "window"
  | "furniture"
  | "annotation";

export type ToolId = "select" | "edit";

export type TabId =
  | "file"
  | "architecture"
  | "view"
  | "insert"
  | "settings"
  | "help"
  | "annotation";

export type CanvasId = "drawing" | "architecture";

export interface ViewportState {
  offset: Point;
  scale: number;
  minScale?: number; // Minimum zoom level
  maxScale?: number; // Maximum zoom level
}

export interface CanvasSize {
  width: number;
  height: number;
  pixelRatio: number;
}

// Tool-specific configurations
export interface DrawToolConfig {
  color: string;
  lineWidth: number;
  lineCap: CanvasLineCap;
  lineJoin: CanvasLineJoin;
}

export interface WallToolConfig {
  thickness: number;
  snapThreshold: number;
  angleSnapThreshold: number;
  showGuides: boolean;
}

// Event types for custom canvas events
export type CanvasEventType =
  | "draw-start"
  | "drawing"
  | "draw-end"
  | "wall-start"
  | "wall-update"
  | "wall-end";

export interface CanvasEvent {
  type: CanvasEventType;
  point: Point;
  tool: ToolId;
  timestamp: number;
}

export interface DrawingLayerProps {
  isActive: boolean;
  viewport: ViewportState;
  brush: BrushBase;
  currentTool: string;
  isDrawing: boolean;
  currentPoints: Point[] | null;
  completedDrawings: DrawingSegment[];
}
