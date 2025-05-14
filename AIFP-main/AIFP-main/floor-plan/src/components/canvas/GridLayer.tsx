import React, { useMemo, memo } from 'react';
import { Layer, Line } from 'react-konva';
import { ViewportState, GridConfig } from '../../types';

interface GridLayerProps {
  viewport: ViewportState;
  gridConfig: GridConfig;
  visible?: boolean;
}

export const GridLayer: React.FC<GridLayerProps> = memo(
  ({ viewport, gridConfig, visible = true }) => {
    const { verticalLines, horizontalLines, axes } = useMemo(() => {
      const {
        gridSize,
        color,
        lineWidth,
        showAxes
      } = gridConfig;
      const {
        offset,
        scale
      } = viewport;

      // Compute boundary indexes for grid lines
      const startX = Math.floor(-offset.x / (gridSize * scale));
      const endX = Math.ceil((-offset.x + window.innerWidth) / (gridSize * scale));
      const startY = Math.floor(-offset.y / (gridSize * scale));
      const endY = Math.ceil((-offset.y + window.innerHeight) / (gridSize * scale));

      // Precompute stroke width to avoid repeated division
      const gridStrokeWidth = lineWidth / scale;
      const axisStrokeWidth = 1 / scale;

      const vLines: JSX.Element[] = [];
      const hLines: JSX.Element[] = [];

      for (let i = startX; i <= endX; i++) {
        const xCoord = i * gridSize;
        vLines.push(
          <Line
            key={`v-${i}`}
            points={[xCoord, startY * gridSize, xCoord, endY * gridSize]}
            stroke={color}
            strokeWidth={gridStrokeWidth}
            listening={false}
          />
        );
      }

      for (let i = startY; i <= endY; i++) {
        const yCoord = i * gridSize;
        hLines.push(
          <Line
            key={`h-${i}`}
            points={[startX * gridSize, yCoord, endX * gridSize, yCoord]}
            stroke={color}
            strokeWidth={gridStrokeWidth}
            listening={false}
          />
        );
      }

      const axesLines: JSX.Element[] = showAxes
        ? [
          <Line
            key="x-axis"
            points={[startX * gridSize, 0, endX * gridSize, 0]}
            stroke="#000"
            strokeWidth={axisStrokeWidth}
            listening={false}
          />,
          <Line
            key="y-axis"
            points={[0, startY * gridSize, 0, endY * gridSize]}
            stroke="#000"
            strokeWidth={axisStrokeWidth}
            listening={false}
          />
        ]
        : [];

      return {
        verticalLines: vLines,
        horizontalLines: hLines,
        axes: axesLines
      };
    }, [viewport, gridConfig]);

    if (!visible) return null;

    return (
      <Layer
        x={viewport.offset.x}
        y={viewport.offset.y}
        scaleX={viewport.scale}
        scaleY={viewport.scale}
        listening={false}
      >
        {verticalLines}
        {horizontalLines}
        {axes}
      </Layer>
    );
  }
);

export default GridLayer;
