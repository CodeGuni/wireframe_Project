// React & External Libraries
import React from "react";
import { Flex } from "@radix-ui/themes";
import * as Icons from 'lucide-react';

// Types
import { CanvasId, ObjectType, SketchTool, ToolId } from "../../../types";
import { RibbonButtonProps } from "../../ribbon-menu";

// Components
import { RibbonPanel } from "../../ribbon-menu/RibbonPanel";
import { RibbonButton } from "../../ribbon-menu/RibbonButton";
import { SketchTypeButton } from "../../ribbon-menu/SketchTypeButton";

type DrawingTool = ToolId;

interface WallModifierProps {
    activeObject: ObjectType;
    activeTool: DrawingTool;
    activeCanvas: CanvasId;
    activeSketchTool: SketchTool;
    onToolChange: (tool: DrawingTool) => void;
    onCanvasChange: (canvas: any) => void;
    setActiveSketchTool: (tool: SketchTool) => void;
}

const WallModifier: React.FC<WallModifierProps> = ({
    activeObject,
    activeTool,
    activeSketchTool,
    activeCanvas,
    onToolChange,
    setActiveSketchTool
}) => {
    if (activeObject === 'free-draw') return;

    const buttons: RibbonButtonProps[] =
        [
            {
                icon: Icons.MousePointer2,
                label: 'Select',
                onClick: () => onToolChange('select'),
                isActive: activeTool === 'select'
            },
            {
                icon: Icons.BrickWall,
                label: 'Create',
                onClick: () => onToolChange('edit'),
                isActive: activeTool === 'edit'
            }
        ];

    return (
        <RibbonPanel key={''} title="Architecture Modify">
            {buttons.map((button, btnIndex) => (
                <RibbonButton
                    key={btnIndex}
                    icon={button.icon}
                    label={button.label}
                    onClick={button.onClick}
                    isActive={button.isActive}
                />
            ))}
            <Flex
                direction={'column'}
                style={{
                    backgroundColor: 'rgb(0 187 40 / 10%)',
                    marginLeft: '15px',
                    padding: '5px',
                    borderWidth: '2px',
                    borderColor: 'rgb(0 187 40)',
                    borderStyle: 'solid'
                }}>
                <Flex gap={'1'}>
                    <SketchTypeButton isActive={activeSketchTool === 'line'}
                        onClick={() => { setActiveSketchTool('line') }} icon={Icons.Minus} label={'line'} />

                    <SketchTypeButton isActive={activeSketchTool === 'rectangle'}
                        onClick={() => { setActiveSketchTool('rectangle') }} icon={Icons.RectangleHorizontal} label={'rectangle'} />

                    <SketchTypeButton isActive={activeSketchTool === 'in-scribed-polygon'}
                        onClick={() => { setActiveSketchTool('in-scribed-polygon') }} icon={Icons.Hexagon} label={'in-scribed-polygon'} />

                    <SketchTypeButton isActive={activeSketchTool === 'circumscribed-polygon'}
                        onClick={() => { setActiveSketchTool('circumscribed-polygon') }} icon={Icons.Hexagon} label={'circumscribed-polygon'} />

                    <SketchTypeButton isActive={activeSketchTool === 'circle'}
                        onClick={() => { setActiveSketchTool('circle') }} icon={Icons.Circle} label={'circle'} />
                </Flex>
                <Flex gap={'1'}>
                    <SketchTypeButton isActive={activeSketchTool === 'start-end-radius-arc'}
                        onClick={() => { setActiveSketchTool('start-end-radius-arc') }} icon={Icons.RectangleHorizontal} label={'start-end-radius-arc'} />

                    <SketchTypeButton isActive={activeSketchTool === 'center-end-arc'}
                        onClick={() => { setActiveSketchTool('center-end-arc') }} icon={Icons.RectangleHorizontal} label={'center-end-arc'} />

                    <SketchTypeButton isActive={activeSketchTool === 'tangent-end-arc'}
                        onClick={() => { setActiveSketchTool('tangent-end-arc') }} icon={Icons.RectangleHorizontal} label={'tangent-end-arc'} />

                    <SketchTypeButton isActive={activeSketchTool === 'fillet-arc'}
                        onClick={() => { setActiveSketchTool('fillet-arc') }} icon={Icons.RectangleHorizontal} label={'fillet-arc'} />

                    <SketchTypeButton isActive={activeSketchTool === 'ellipse'}
                        onClick={() => { setActiveSketchTool('ellipse') }} icon={Icons.RectangleHorizontal} label={'ellipse'} />
                </Flex>
            </Flex>
        </RibbonPanel>
    )
};

export default WallModifier;