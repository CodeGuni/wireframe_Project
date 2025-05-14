import { ViewportState, Point } from "../types";

export const getVirtualCoordinates = (
  event: { clientX: number; clientY: number },
  rect: DOMRect,
  viewport: ViewportState
): Point => {
  const x = (event.clientX - rect.left - viewport.offset.x) / viewport.scale;
  const y = (event.clientY - rect.top - viewport.offset.y) / viewport.scale;
  return { x, y };
};

export const getScreenCoordinates = (
  point: Point,
  viewport: ViewportState
): Point => {
  return {
    x: point.x * viewport.scale + viewport.offset.x,
    y: point.y * viewport.scale + viewport.offset.y,
  };
};

export const getCenterPoint = (A: Point, B: Point): Point => {
  return {
    x: (A.x + B.x) / 2,
    y: (A.y + B.y) / 2,
  };
};