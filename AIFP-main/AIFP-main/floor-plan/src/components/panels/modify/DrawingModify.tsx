import React from "react";
import { RibbonPanel } from "../../ribbon-menu/RibbonPanel";
import * as Icons from 'lucide-react';
import { RibbonButtonProps } from "../../ribbon-menu";
import { RibbonButton } from "../../ribbon-menu/RibbonButton";
import { CanvasId, ObjectType, TabId, ToolId } from "../../../types";
import { SizePanel } from "../../ribbon-menu/SizePanel";
import { BrushBase } from "../../../types/drawing";
import { ColorPanel } from "../../ui/ColorPanel";

type DrawingTool = ToolId;

interface DrawingModifyProps {
    activeObject: ObjectType;
    activeTool: DrawingTool;
    activeCanvas: CanvasId;
    activeTab: TabId;
    currentBrush: BrushBase
    onToolChange: (tool: DrawingTool) => void;
    onCanvasChange: (canvas: any) => void;
    setBrush: (brush: BrushBase) => void;
}

const DrawingModify: React.FC<DrawingModifyProps> = ({
    activeObject,
    activeTool,
    activeTab,
    activeCanvas,
    currentBrush,
    setBrush }) => {
    if (activeObject !== "free-draw") return null;
    const buttons: RibbonButtonProps[] =
        [
            {
                icon: Icons.Pencil,
                label: 'Brush',
                onClick: () => setBrush({
                    ...currentBrush,
                    isEraser: false
                }),
                isActive: !currentBrush.isEraser
            },
            {
                icon: Icons.Eraser,
                label: 'Eraser',
                onClick: () => setBrush({
                    ...currentBrush,
                    isEraser: true
                }),
                isActive: currentBrush.isEraser
            }
        ];

    return (
        <RibbonPanel key={'drawing-modify'} title="Drawing Modify">
            {buttons.map((button, btnIndex) => (
                <RibbonButton
                    key={btnIndex}
                    icon={button.icon}
                    label={button.label}
                    onClick={button.onClick}
                    isActive={button.isActive}
                />
            ))}
            <ColorPanel currentBrush={currentBrush} setBrush={setBrush}></ColorPanel>
            <SizePanel currentBrush={currentBrush} setBrush={setBrush} ></SizePanel>
        </RibbonPanel>
    )
};

export default DrawingModify;