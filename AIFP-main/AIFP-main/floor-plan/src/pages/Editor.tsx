import React, { useState, useCallback, useRef, useEffect } from 'react';
import RibbonMenu from '../components/ribbon-menu/RibbonMenu';
import { ToolId, GridConfig, CanvasId, TabId, ObjectType, SketchTool } from '../types';
import { ViewportState } from '../types';
import MainCanvas from '../components/canvas/MainCanvas';
import { BottomBar } from '../components/panels/BottomBar'
import { BrushBase } from "../types/drawing";
import { panelManager } from '../components/panels/PanelManager';
import { GridConfigPanel } from '../components/panels/GridConfigPanel';
import { Theme, Box } from "@radix-ui/themes";
import { KeyboardManager } from '../core/keyboard';

const Editor: React.FC = () => {
    const keyboardManager = KeyboardManager.getInstance();
    // Force re-render when panel states change
    const [, setForceUpdate] = useState({});
    // Tool and Style State
    const [activeObject, setActiveObject] = useState<ObjectType>("wall");
    const [activeSketchTool, setActiveSketchTool] = useState<SketchTool>("line");
    const [activeTab, setActiveTab] = useState<TabId>("architecture");
    const [activeTool, setActiveTool] = useState<ToolId>("edit");
    const [activeCanvas, setActiveCanvas] = useState<CanvasId>("architecture");
    const [drawingBrush, setBrush] = useState<BrushBase>(
        { color: "#000000", size: 20, isEraser: false }
    );

    //#region Panel Management

    // Grid Configuration State
    const [gridConfig, setGridConfig] = useState<GridConfig>({
        enabled: true,
        color: '#E0E0E0',
        lineWidth: 0.5,
        unitSystem: 'metric',
        gridSize: 100,
        showAxes: false,
        showLabels: false,
        snapToGrid: true
    });

    //#endregion

    // Viewport State
    const [viewport, setViewport] = useState<ViewportState>({
        offset: { x: 0, y: 0 },
        scale: 1
    });

    // Grid Config Handler
    const handleGridConfigChange = (newConfig: Partial<GridConfig>) => {
        setGridConfig(prev => ({ ...prev, ...newConfig }));
    };

    // Viewport Change Handler
    const handleViewportChange = (newViewport: ViewportState) => {
        setViewport(newViewport);
    };

    useEffect(() => {
        const unsubscribe = panelManager.subscribe(() => {
            setForceUpdate({});
        });
        return () => unsubscribe();
    }, []);

    return (
        <Theme>
            <Box style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                {/* Row 1: RibbonMenu - Fixed Height */}
                <Box>
                    <RibbonMenu
                        activeObject={activeObject}
                        activeTool={activeTool}
                        activeCanvas={activeCanvas}
                        activeSketchTool={activeSketchTool}
                        gridConfig={gridConfig}
                        currentBrush={drawingBrush}
                        panelManager={panelManager}
                        setActiveObject={setActiveObject}
                        setActiveTool={setActiveTool}
                        setActiveCanvas={setActiveCanvas}
                        onGridConfigChange={handleGridConfigChange}
                        setActiveBrush={setBrush}
                        setActiveTab={setActiveTab}
                        setActiveSketchTool={setActiveSketchTool}
                    />
                </Box>

                {/* Row 2: Canvas Area - Flexible Height */}
                <Box style={{
                    flex: '1 1 0%',
                    minHeight: 0,
                    position: 'relative'
                }}>
                    <MainCanvas
                        activeObject={activeObject}
                        activeTool={activeTool}
                        activeCanvas={activeCanvas}
                        viewport={viewport}
                        gridConfig={gridConfig}
                        onViewportChange={handleViewportChange}
                        brush={drawingBrush}
                        setActiveTool={setActiveTool}
                    />
                </Box>

                {/* Row 3: Bottom Bar - Fixed Height */}
                <Box style={{ flexShrink: 0, boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)' }}>
                    <BottomBar
                        scale={viewport.scale}
                    />
                </Box>

                <GridConfigPanel
                    config={gridConfig}
                    panelManager={panelManager}
                    onConfigChange={handleGridConfigChange}
                />
            </Box>
        </Theme>
    );
};

export default Editor;