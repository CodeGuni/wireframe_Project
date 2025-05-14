import { ViewportState } from ".";

export interface BaseCanvasProps {
  isActive: boolean;
  viewport: ViewportState;
  className?: string;
  style?: React.CSSProperties;
}

export interface CanvasContextType {
  requestRedraw: () => void;
  viewport: ViewportState;
}

export interface LayerManagerContextType {
  activeLayer: string | null;
  setActiveLayer: (layerId: string | null) => void;
}
