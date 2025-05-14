import { Point } from ".";
import { Geometry, WallGeometry } from "./geometry";

export interface ShapeStyle {
  fillColor: string;
  highLightColor?: string;
  strokeColor: string;
  strokeWidth: number;
}
export interface TransformMatrix {
  translate?: Point;
  scale?: Point;
  rotate?: number;
  origin?: Point; // Point of rotation/scaling
}

export interface HandleProperties {
  size: number;
  style: ShapeStyle;
}

export interface Transform {
  transformPoint(point: Point): Point;
}

export interface IShapeData {
  id?: string;
  position: Point;
  geometry: Geometry;
  handleProperties?: HandleProperties;
  metadata?: {
    createdAt?: Date;
    lastModified?: Date;
    author?: string;
    [key: string]: any;
  };
  style: ShapeStyle;
}

// Wall specific configuration
export interface WallData extends IShapeData {
  geometry: WallGeometry;
  thickness: number;
  cornerRadius?: number; // Optional: for rounded corners
  texture?: string; // Optional: for wall texturing
  metadata?: {
    material?: string;
    isLoadBearing?: boolean;
    [key: string]: any;
  };
}

// Text style configuration
export interface TextStyle {
  fontSize: number;
  fontFamily: string;
  fontWeight?: string | number;
  fontStyle: "normal" | "italic" | "oblique";
  textAlign: "left" | "center" | "right";
  textBaseline?: "top" | "middle" | "bottom";
  letterSpacing?: number;
  lineHeight?: number;
  textColor: string;
  backgroundColor?: string;
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
}

// Text shape configuration
export interface TextShapeData extends IShapeData {
  text: string | "New Text";
  textStyle: TextStyle;
  isEditable?: boolean;
  isResizable?: boolean;
  rotation?: number;
}
