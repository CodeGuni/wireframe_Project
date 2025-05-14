import { RefObject } from "react";
import { PanelManager } from "./PanelManager";
import { GridConfig } from "../../types";
export interface PanelState {
  isOpen: boolean;
  triggerRef: RefObject<HTMLButtonElement> | null;
  position?: { x: number; y: number };
}

export type PanelStateChangeCallback = () => void;
export type PanelType =
  | "gridConfig"
  | "brushSettings"
  | "layerSettings"
  | "exportSettings";

export interface GridConfigPanelProps {
  config: GridConfig;
  onConfigChange: (newConfig: Partial<GridConfig>) => void;
  panelManager: PanelManager;
}
