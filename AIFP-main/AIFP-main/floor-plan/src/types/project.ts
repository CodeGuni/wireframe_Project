import { Point } from ".";

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  walls: WallData[];
  drawings: DrawingData[];
  settings: ProjectSettings;
}

export interface WallData {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  color: string;
}

export interface DrawingData {
  id: string;
  points: Point[];
  brushSize: number;
  color: string;
}

export interface ProjectSettings {
  gridEnabled: boolean;
  gridSize: number;
  snapToGrid: boolean;
  units: "metric" | "imperial";
  scale: number;
}
