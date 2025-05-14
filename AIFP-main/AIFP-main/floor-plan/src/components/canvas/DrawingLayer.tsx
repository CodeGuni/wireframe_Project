import React, { memo, useMemo } from 'react';
import { Layer, Line } from 'react-konva';
import { DrawingLayerProps, Point } from '../../types';

function pointsToFlatArray(points: Point[]): number[] {
    return points.reduce<number[]>((flat, { x, y }) => {
        flat.push(x, y);
        return flat;
    }, []);
}

export const DrawingLayer: React.FC<DrawingLayerProps> = memo(
    ({
        isActive,
        viewport,
        brush,
        currentTool,
        isDrawing,
        currentPoints,
        completedDrawings
    }) => {
        // Render completed drawings
        const renderedCompletedDrawings = useMemo(() => {
            return completedDrawings.map((segment, i) => (
                <Line
                    key={`drawing-${i}`}
                    points={pointsToFlatArray(segment.points)}
                    stroke={segment.isEraser ? 'white' : segment.strokeStyle}
                    strokeWidth={segment.lineWidth}
                    lineCap="round"
                    lineJoin="round"
                    globalCompositeOperation={
                        segment.isEraser ? 'destination-out' : 'source-over'
                    }
                    listening={false}
                />
            ));
        }, [completedDrawings]);

        // Render the current drawing path
        const renderedCurrentDrawing = useMemo(() => {
            if (!isDrawing || (currentPoints && currentPoints.length === 0)) return null;
            return (
                <Line
                    points={pointsToFlatArray(currentPoints || [])}
                    stroke={brush.isEraser ? 'white' : brush.color}
                    strokeWidth={brush.size}
                    lineCap="round"
                    lineJoin="round"
                    globalCompositeOperation={
                        brush.isEraser ? 'destination-out' : 'source-over'
                    }
                    listening={false}
                />
            );
        }, [isDrawing, currentPoints, brush]);

        return (
            <Layer
                x={viewport.offset.x}
                y={viewport.offset.y}
                scaleX={viewport.scale}
                scaleY={viewport.scale}
                listening={isActive}
            >
                {renderedCompletedDrawings}
                {renderedCurrentDrawing}
            </Layer>
        );
    }
);

export default DrawingLayer;
