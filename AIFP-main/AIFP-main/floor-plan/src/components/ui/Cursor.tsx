import React from 'react';
import { Group, Circle, Line } from 'react-konva';
import { ObjectType, Point, ToolId } from '../../types';
import { BrushBase } from "../../types/drawing";

interface CanvasCursorProps {
    activeObject: ObjectType;
    tool: ToolId;
    position: Point | null;
    scale: number;
    brush?: BrushBase;
}

export const CanvasCursor: React.FC<CanvasCursorProps> = ({ activeObject, tool, position, scale, brush }) => {
    if (!position) return null;

    if (tool === 'select') {
        return (
            <Group x={position.x} y={position.y}>
                <Line
                    points={[-10 / scale, 0, 10 / scale, 0]}
                    stroke="black"
                    strokeWidth={1 / scale}
                />
                <Line
                    points={[0, -10 / scale, 0, 10 / scale]}
                    stroke="black"
                    strokeWidth={1 / scale}
                />
            </Group>
        );
    }

    switch (activeObject) {
        case 'wall':
            return (
                <Group x={position.x} y={position.y}>
                    <Circle
                        radius={5 / scale}
                        fill="transparent"
                        stroke="black"
                        strokeWidth={1 / scale}
                    />
                    <Line
                        points={[-10 / scale, 0, 10 / scale, 0]}
                        stroke="black"
                        strokeWidth={1 / scale}
                    />
                    <Line
                        points={[0, -10 / scale, 0, 10 / scale]}
                        stroke="black"
                        strokeWidth={1 / scale}
                    />
                </Group>
            );
        case 'free-draw':
            if (!brush) return null;
            return (
                <Group x={position.x} y={position.y}>
                    <Circle
                        radius={(brush.size / 2)}
                        fill={brush.isEraser ? 'white' : brush.color}
                        stroke={brush.isEraser ? 'black' : 'transparent'}
                        strokeWidth={brush.isEraser ? 1 / scale : 0}
                    />
                </Group>
            );
        default:
            return (
                <Group x={position.x} y={position.y}>
                    <Line
                        points={[-10 / scale, 0, 10 / scale, 0]}
                        stroke="black"
                        strokeWidth={1 / scale}
                    />
                    <Line
                        points={[0, -10 / scale, 0, 10 / scale]}
                        stroke="black"
                        strokeWidth={1 / scale}
                    />
                </Group>
            );;
    }
};