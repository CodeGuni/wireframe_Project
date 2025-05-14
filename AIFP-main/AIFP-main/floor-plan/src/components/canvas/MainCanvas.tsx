// React & Core Dependencies 
import React, { useCallback, useEffect, useRef, useState } from 'react';

// External Libraries
import { Flex } from '@radix-ui/themes';
import { KonvaEventObject } from 'konva/lib/Node';
import { Layer, Rect, Shape, Stage } from 'react-konva';

// Types
import { BrushBase } from "../../types/drawing";
import {
    CanvasId,
    DrawingSegment,
    GridConfig,
    ObjectType,
    Point,
    ToolId,
    ViewportState,
} from '../../types';
import { TextShapeData, WallData } from '../../types/shape';

// Core
import { ShapeFactory } from '../../core/factory/ShapeFactory';
import { ShapeManager } from '../../core/manager/ShapeManager';
import { IShape } from '../../core/shapes/base/IShape';
import { Wall } from '../../core/shapes/implementations/Wall';

// Components
import { CanvasCursor } from '../ui/Cursor';
import { DrawingLayer } from './DrawingLayer';
import GridLayer from './GridLayer';

// Hooks & Utils
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { getVirtualCoordinates } from '../../utils/coordinates';
import { PointUtils } from '../../utils/PointUtils';
import { useClipboardPaste } from '../../hooks/useClipboardPaste';
import { ImageShapeData } from '../../core/shapes/implementations/ImageShape';

interface MainCanvasProps {
    activeObject: ObjectType;
    activeTool: ToolId;
    activeCanvas: CanvasId;
    viewport: ViewportState;
    gridConfig: GridConfig;
    brush: BrushBase;
    onViewportChange: (newViewport: ViewportState) => void;
    setActiveTool: (tool: ToolId) => void;
}

export const MainCanvas: React.FC<MainCanvasProps> = ({
    activeObject,
    activeTool,
    activeCanvas,
    viewport,
    gridConfig,
    brush,
    onViewportChange,
    setActiveTool
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const shapeManagerRef = useRef<ShapeManager>(new ShapeManager());
    const factory = ShapeFactory.getInstance();

    // Dimensions
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Drawing
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
    const [completedDrawings, setCompletedDrawings] = useState<DrawingSegment[]>([]);

    // Actions
    const [isPanning, setIsPanning] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedHandle, setDraggedHandle] = useState<{ shapeId: string; handleIndex: number } | null>(null);

    // Positions
    const [panStart, setPanStart] = useState<Point | null>(null);
    const [dragStartPoint, setDragStartPoint] = useState<Point | null>(null);
    const [lastPointer, setLastPointer] = useState<Point | null>(null);

    // Shape creation & selection
    const [isCreatingShape, setIsCreatingShape] = useState(false);
    const [shapeStartPoint, setShapeStartPoint] = useState<Point | null>(null);
    const [previewShape, setPreviewShape] = useState<IShape | null>(null);
    const [selectionBox, setSelectionBox] = useState<{ start: Point; end: Point } | null>(null);
    const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
    const [hoveringShape, setHoveringShape] = useState<string | null>(null);

    useKeyboardShortcuts(
        shapeManagerRef.current,
        selectedShapes,
        setActiveTool
    );

    // Update dimensions on container or window resize
    useEffect(() => {
        if (!containerRef.current) return;
        const updateDimensions = () => {
            if (!containerRef.current) return;
            setDimensions({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight
            });
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Zoom (wheel)
    const handleWheel = useCallback(
        (e: KonvaEventObject<WheelEvent>) => {
            e.evt.preventDefault();
            const stage = e.target.getStage();
            if (!stage) return;

            const oldScale = viewport.scale;
            const pointerPos = stage.getPointerPosition() ?? { x: 0, y: 0 };
            const scaleBy = 1.1;

            const mousePointTo = {
                x: pointerPos.x / oldScale - viewport.offset.x / oldScale,
                y: pointerPos.y / oldScale - viewport.offset.y / oldScale
            };

            const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
            const newOffset = {
                x: -(mousePointTo.x - pointerPos.x / newScale) * newScale,
                y: -(mousePointTo.y - pointerPos.y / newScale) * newScale
            };
            onViewportChange({ ...viewport, scale: newScale, offset: newOffset });
        },
        [viewport, onViewportChange]
    );

    // Mouse down
    const handleMouseDown = useCallback(
        (e: KonvaEventObject<MouseEvent>) => {
            const stage = e.target.getStage();
            if (!stage) return;

            // Middle click → panning
            if (e.evt.button === 1) {
                setIsPanning(true);
                setPanStart({ x: e.evt.clientX, y: e.evt.clientY });
                return;
            }
            // Left click only
            if (e.evt.button !== 0 || isPanning) return;

            const rect = stage.container().getBoundingClientRect();
            const pointer = getVirtualCoordinates(e.evt, rect, viewport);
            setLastPointer(pointer);

            // Check if a handle is being dragged
            const foundShapes = shapeManagerRef.current.findShapesAtPoint(pointer);

            for (const [id, shape] of foundShapes) {
                const handleIndex = shape.getHandleAtPoint(pointer);
                if (handleIndex !== null) {
                    shape.captureState();
                    setDraggedHandle({ shapeId: id, handleIndex });
                    return;
                }
            }

            // Check if a shape is being clicked
            const clickedShapes = foundShapes.map(([id]) => id);
            if (clickedShapes.length > 0) {
                setSelectedShapes(clickedShapes);
                clickedShapes.forEach(id => shapeManagerRef.current.bringShapeToFront(id));
                setIsDragging(true);
                setDragStartPoint(pointer);
                return
            } else {
                setSelectionBox({ start: pointer, end: pointer });
                if (activeTool === 'select') {
                    setSelectedShapes([]);
                    return;
                }
            }

            switch (activeObject) {
                case 'free-draw':
                    {
                        beginDrawing(setIsDrawing, setCurrentPoints, pointer);
                    }
                    break;
                case 'wall':
                    {
                        createWallPreview(pointer, factory, setPreviewShape, setShapeStartPoint, setIsCreatingShape);
                    }
                    break;
            }
        },
        [isPanning, viewport, activeObject, activeTool, factory]
    );

    // Mouse move
    const handleMouseMove = useCallback(
        (e: KonvaEventObject<MouseEvent>) => {
            const stage = e.target.getStage();
            if (!stage) return;

            const rect = stage.container().getBoundingClientRect();
            const pointer = getVirtualCoordinates(e.evt, rect, viewport);
            setLastPointer(pointer);

            // Hover detection
            const hovered = shapeManagerRef.current.findShapesAtPoint(pointer).map(([id]) => id);
            setHoveringShape(hovered.length > 0 ? hovered[0] : null);

            // If dragging a shape handle
            if (draggedHandle) {
                shapeManagerRef.current.updateShapeByHandle(
                    draggedHandle.shapeId,
                    draggedHandle.handleIndex,
                    pointer
                );
                return;
            }

            // Panning
            if (isPanning && panStart) {
                const dx = e.evt.clientX - panStart.x;
                const dy = e.evt.clientY - panStart.y;
                onViewportChange({
                    ...viewport,
                    offset: {
                        x: viewport.offset.x + dx,
                        y: viewport.offset.y + dy
                    }
                });
                setPanStart({ x: e.evt.clientX, y: e.evt.clientY });
                return;
            }

            // Shape dragging
            if (isDragging && dragStartPoint && selectedShapes.length > 0) {
                selectedShapes.forEach(shapeId => {
                    const shape = shapeManagerRef.current.getShape(shapeId);
                    if (shape) {
                        shape.moveTo(dragStartPoint, pointer);
                    }
                });
                return;
            }

            // Freehand drawing
            if (isDrawing) {
                setCurrentPoints(prev => [...prev, pointer]);
                return;
            }

            // Creating wall
            if (isCreatingShape && shapeStartPoint && previewShape instanceof Wall) {
                previewShape.setEnd(pointer);
                return;
            }

            // Selection box
            if (selectionBox) {
                setSelectionBox(prev => prev && ({ start: prev.start, end: pointer }));
            }
        },
        [viewport, draggedHandle, isPanning, panStart, isDragging, dragStartPoint, selectedShapes, selectionBox, isDrawing, isCreatingShape, shapeStartPoint, previewShape, onViewportChange]
    );

    // Mouse up
    const handleMouseUp = useCallback(() => {
        // Finished handle dragging
        if (draggedHandle) {
            shapeManagerRef.current.updateShapesPosition(selectedShapes);
            setDraggedHandle(null);
            setIsDragging(false);
            return;
        }
        // Finished panning
        if (isPanning) {
            setIsPanning(false);
            setPanStart(null);
            return;
        }
        // Finished shape dragging
        if (isDragging) {
            shapeManagerRef.current.updateShapesPosition(selectedShapes);
            setIsDragging(false);
            setDragStartPoint(null);
        }
        // Finished freehand drawing
        if (isDrawing) {
            if (currentPoints.length > 1) {
                setCompletedDrawings(prev => [
                    ...prev,
                    {
                        points: currentPoints.slice(),
                        strokeStyle: brush.color,
                        lineWidth: brush.size,
                        isEraser: brush.isEraser
                    }
                ]);
            }
            setIsDrawing(false);
            setCurrentPoints([]);
            setSelectionBox(null);
            return;
        }
        if (activeTool != 'select') {
            // Finished shape creation
            if (isCreatingShape && previewShape) {
                const shapeId = shapeManagerRef.current.addShape(
                    previewShape.getType(),
                    previewShape.getProperties()
                );
                if (shapeId) setSelectedShapes([shapeId]);
                setPreviewShape(null);
                setIsCreatingShape(false);
                setShapeStartPoint(null);
            }
            if (activeObject === 'annotation' && selectionBox) {
                if (PointUtils.distanceBetweenPoints(selectionBox.start, selectionBox.end) < 20) {
                    setSelectionBox(null);
                    return
                };
                createATextShape(selectionBox);
                setSelectionBox(null);
                return;
            }
        }

        // Finished selection box
        if (selectionBox) {
            shapeManagerRef.current
                .getShapeLikeRevit(selectionBox)
                .forEach(([id]) => {
                    setSelectedShapes(prev => {
                        return prev.includes(id)
                            ? prev.filter(shapeId => shapeId !== id)
                            : [...prev, id];
                    });
                });
            setSelectionBox(null);
        }
    }, [draggedHandle, isPanning, isDragging, isDrawing, activeTool, selectionBox, selectedShapes, currentPoints, brush.color, brush.size, brush.isEraser, isCreatingShape, previewShape, activeObject]);

    function beginDrawing(setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>, setCurrentPoints: React.Dispatch<React.SetStateAction<Point[]>>, pointer: Point) {
        setIsDrawing(true);
        setCurrentPoints([pointer]);
    }

    useClipboardPaste({
        // Optional callback when image is pasted
        onPaste: (img) => {
            // console.log('New image pasted:', img.width, img.height);
            createAnImageShape(img);
        },
        onPasteText: (text) => {
            const DEFAULT_WIDTH = 100;
            const DEFAULT_HEIGHT = 20;
            createATextShape({
                start: { x: lastPointer?.x ?? 0 - DEFAULT_WIDTH / 2, y: lastPointer?.y ?? 0 + DEFAULT_HEIGHT / 2 },
                end: { x: lastPointer?.x ?? 0 - DEFAULT_WIDTH / 2, y: lastPointer?.y ?? 0 + DEFAULT_HEIGHT / 2 }
            }, text);
        }
    });

    function createAnImageShape(_img: HTMLImageElement) {
        const imgShape: ImageShapeData = {
            // Calculate center position by considering image dimensions
            position: lastPointer ?? {
                x: window.innerWidth / 2,  // Default to center of viewport if no pointer
                y: window.innerHeight / 2 // Default to center of viewport if no pointer
            },
            imageData: {
                src: _img.src, // Store image source
                width: _img.width, // Store image dimensions
                height: _img.height, // Store image dimensions
                naturalWidth: _img.naturalWidth,  // Store original dimensions
                naturalHeight: _img.naturalHeight // Store original dimensions
            },
            // Calculate geometry from center position
            geometry: {
                topLeft: {
                    x: (lastPointer?.x ?? window.innerWidth / 2) - _img.width / 2,
                    y: (lastPointer?.y ?? window.innerHeight / 2) - _img.height / 2
                },
                bottomRight: {
                    x: (lastPointer?.x ?? window.innerWidth / 2) + _img.width / 2,
                    y: (lastPointer?.y ?? window.innerHeight / 2) + _img.height / 2
                }
            },
            style: { fillColor: '#FFFFFF', strokeColor: '#000000', strokeWidth: 1 }
        };

        const shapeId = shapeManagerRef.current.addShape('image', imgShape); // Add image shape
        if (shapeId) setSelectedShapes([shapeId]); // Select image shape
    }

    function createATextShape(boxData: { start: Point; end: Point; }, text: string = "New Text") {
        // console.log(boxData);

        const textConfig: TextShapeData = {
            position: PointUtils.getCenter([boxData.start, boxData.end]),
            text: text,
            style: {
                fillColor: '#FFFFFF',
                strokeColor: '#000000',
                strokeWidth: 1
            },
            textStyle: {
                fontSize: 16,
                fontFamily: 'Arial',
                fontStyle: 'normal',
                textAlign: 'center',
                textColor: '#000000'
            },
            handleProperties: {
                size: 5,
                style: {
                    fillColor: '#FF0000',
                    strokeColor: '#000000',
                    strokeWidth: 1
                }
            },
            geometry: {
                topLeft: boxData.start,
                bottomRight: boxData.end
            }
        };
        const shapeId = shapeManagerRef.current.addShape('text', textConfig);
        if (shapeId) setSelectedShapes([shapeId]);
    }

    function createWallPreview(pointer: Point, factory: ShapeFactory, setPreviewShape: React.Dispatch<React.SetStateAction<IShape | null>>, setShapeStartPoint: React.Dispatch<React.SetStateAction<Point | null>>, setIsCreatingShape: React.Dispatch<React.SetStateAction<boolean>>) {
        const wallConfig: WallData = {
            position: pointer,
            geometry: { start: pointer, end: pointer },
            thickness: 20,
            style: {
                fillColor: '#E0E0E0',
                strokeColor: '#000000',
                strokeWidth: 2,
                highLightColor: '#FF0000'
            },
            handleProperties: {
                size: 3,
                style: {
                    fillColor: '#FF0000',
                    strokeColor: '#000000',
                    strokeWidth: 1
                }
            }
        };
        const previewWall = factory.createShape('wall', wallConfig);
        setPreviewShape(previewWall);
        setShapeStartPoint(pointer);
        setIsCreatingShape(true);
    }

    return (
        <Flex
            ref={containerRef}
            style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                height: '100%',
                width: '100%',
                cursor: 'none'
            }}
        >
            <Stage
                width={dimensions.width}
                height={dimensions.height}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onWheel={handleWheel}
            >
                {/* Grid */}
                <GridLayer viewport={viewport} gridConfig={gridConfig} />

                {/* Freehand drawing */}
                <DrawingLayer
                    isActive={activeCanvas === 'drawing'}
                    currentTool={activeTool}
                    viewport={viewport}
                    brush={brush}
                    isDrawing={isDrawing}
                    currentPoints={currentPoints}
                    completedDrawings={completedDrawings}
                />

                {/* Shapes */}
                <Layer
                    x={viewport.offset.x}
                    y={viewport.offset.y}
                    scaleX={viewport.scale}
                    scaleY={viewport.scale}
                >
                    {Array.from(shapeManagerRef.current.getAllShapes()).map(([id, shape]) => (
                        <ShapeRenderer
                            key={id}
                            shape={shape}
                            isSelected={selectedShapes.includes(id)}
                            isHovered={hoveringShape === id}
                        />
                    ))}
                    {previewShape && (
                        <ShapeRenderer
                            shape={previewShape}
                            isPreview
                            isSelected
                        />
                    )}
                </Layer>

                {/* Selection Box + Cursor */}
                <Layer
                    x={viewport.offset.x}
                    y={viewport.offset.y}
                    scaleX={viewport.scale}
                    scaleY={viewport.scale}
                    listening={false}
                >
                    {selectionBox && (
                        <Rect
                            x={Math.min(selectionBox.start.x, selectionBox.end.x)}
                            y={Math.min(selectionBox.start.y, selectionBox.end.y)}
                            width={Math.abs(selectionBox.start.x - selectionBox.end.x)}
                            height={Math.abs(selectionBox.start.y - selectionBox.end.y)}
                            fill="rgba(0, 0, 255, 0.3)"
                            stroke="blue"
                            strokeWidth={1}
                        />
                    )}
                    <CanvasCursor
                        tool={activeTool}
                        activeObject={activeObject}
                        position={lastPointer}
                        scale={viewport.scale}
                        brush={brush}
                    />
                </Layer>
            </Stage>
        </Flex>
    );
};

interface ShapeRendererProps {
    shape: IShape;
    isSelected?: boolean;
    isPreview?: boolean;
    isHovered?: boolean;
}

const ShapeRenderer: React.FC<ShapeRendererProps> = ({
    shape,
    isSelected = false,
    isPreview = false,
    isHovered = false
}) => {
    const shapeRef = useRef<any>(null);

    useEffect(() => {
        if (!shapeRef.current) return;
        shape.setSelected(isSelected);
        shape.setHovered(isHovered);
        shapeRef.current.getLayer()?.batchDraw();
    }, [shape, isSelected, isPreview, isHovered]);

    return (
        <Shape
            ref={shapeRef}
            sceneFunc={ctx => shape.render(ctx)}
            perfectDrawEnabled={false}
            listening={!isPreview}
        />
    );
};

export default MainCanvas;