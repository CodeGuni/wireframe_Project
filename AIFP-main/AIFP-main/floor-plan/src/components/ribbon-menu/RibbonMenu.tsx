import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { RibbonConfiguration } from './index';
import { RibbonPanel } from './RibbonPanel';
import { RibbonButton } from './RibbonButton';
import { RibbonTab } from './RibbonTab';
import DrawingModify from '../panels/modify/DrawingModify';
import WallModifier from '../panels/modify/WallModifier';
import { Flex } from '@radix-ui/themes';
import { CanvasId, GridConfig, ObjectType, SketchTool, TabId, ToolId } from '../../types';
import { BrushBase } from '../../types/drawing';
import { PanelManager } from '../panels/PanelManager';

export interface RibbonMenuProps {
    setActiveObject: (object: ObjectType) => void;
    setActiveCanvas: (canvas: CanvasId) => void;
    setActiveTool: (tool: ToolId) => void;
    setActiveBrush: (tool: BrushBase) => void;
    setActiveTab: (tab: TabId) => void;
    onGridConfigChange: (config: Partial<GridConfig>) => void;
    setActiveSketchTool: (tool: SketchTool) => void;
    activeObject: ObjectType;
    activeTool: ToolId;
    activeCanvas: CanvasId;
    activeSketchTool: SketchTool;
    gridConfig: GridConfig;
    currentBrush: BrushBase;
    panelManager: PanelManager;
}

const RibbonMenu: React.FC<RibbonMenuProps> = ({
    setActiveObject,
    setActiveTool,
    setActiveCanvas,
    setActiveBrush,
    setActiveSketchTool,
    activeObject,
    activeTool,
    activeSketchTool,
    activeCanvas,
    currentBrush,
    panelManager
}) => {
    const [activeTab, setActiveTab] = useState<TabId>('architecture');

    const ribbonConfiguration: RibbonConfiguration = {
        file: [
            {
                title: 'Actions',
                buttons: [
                    {
                        icon: Icons.FilePlus,
                        label: 'New',
                        onClick: () => { },
                        isActive: false
                    },
                    {
                        icon: Icons.FolderOpen,
                        label: 'Load',
                        onClick: () => { },
                        isActive: false
                    },
                    {
                        icon: Icons.Save,
                        label: 'Save',
                        onClick: () => { },
                        isActive: false
                    },
                    {
                        icon: Icons.FileUp,
                        label: 'Export',
                        onClick: () => { },
                        isActive: false
                    }
                ],
            }],
        architecture: [
            {
                title: 'Architecture',
                buttons: [
                    {
                        icon: Icons.BrickWall,
                        label: 'Wall',
                        onClick: () => {
                            setActiveObject('wall');
                            setActiveTool('edit');
                        },
                        isActive: activeObject === 'wall'
                    },
                    {
                        icon: Icons.DoorClosed,
                        label: 'Door',
                        isActive: activeObject === 'door',
                    },
                    {
                        icon: Icons.Grid2x2,
                        label: 'Window',
                        isActive: activeObject === 'window',
                    },
                    {
                        icon: Icons.Armchair,
                        label: 'Furniture',
                        isActive: activeObject === 'furniture',
                    }
                ],
            }
        ], annotation: [
            {
                title: 'Anotation',
                buttons: [
                    {
                        icon: Icons.Brush,
                        label: 'Draw',
                        onClick: () => {
                            setActiveObject('free-draw');
                            setActiveTool('edit');
                        },
                        isActive: activeObject === 'free-draw'
                    },
                    {
                        icon: Icons.Type,
                        label: 'Text',
                        onClick: () => {
                            setActiveObject('annotation');
                            setActiveTool('edit');
                        },
                        isActive: activeObject === 'annotation'
                    },
                    {
                        icon: Icons.ArrowUpRight,
                        label: 'Arrow'
                    }
                ],
            }
        ],
        view: [{
            title: 'Themes',
            buttons: [
                {
                    icon: Icons.Grid3x3,
                    label: 'Grid',
                    isActive: false,
                    onClick: () => {
                        panelManager.togglePanel('gridConfig');
                    }
                },
                {
                    icon: Icons.MoonStar,
                    label: 'Dark',
                    isActive: false
                }
            ],
        }],
        insert: [
            {
                title: 'CAD',
                buttons: [
                    {
                        icon: Icons.PlusCircle,
                        label: 'Insert',
                        onClick: () => {
                            console.log('Insert');
                        },
                        isActive: false
                    }
                ],
            }
        ],
        settings: [
            {
                title: 'Preferences',
                buttons: [
                    {
                        icon: Icons.Settings,
                        label: 'Options',
                        isActive: false,
                        onClick: () => {
                            panelManager.togglePanel('gridConfig');
                        }
                    },
                ],
            },
        ],
        help: [
            {
                title: 'Help',
                buttons: [
                    {
                        icon: Icons.MessageCircleQuestion,
                        label: 'Options',
                    },
                ],
            },
        ],
    };

    const tabs = [
        { id: 'file' as TabId, label: 'File' },
        { id: 'architecture' as TabId, label: 'Architecture' },
        { id: 'annotation' as TabId, label: 'Annotate' },
        { id: 'view' as TabId, label: 'View' },
        { id: 'insert' as TabId, label: 'Insert' },
        { id: 'settings' as TabId, label: 'Settings' },
        { id: 'help' as TabId, label: 'Help' }
    ];

    return (
        <Flex style={{ flexDirection: 'column', boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', zIndex: 100 }}>
            <Flex direction="row" style={{ background: "rgb(245 245 245)", borderBottom: "1px solid var(--gray-4)" }}>
                {tabs.map((tab) => (
                    <RibbonTab
                        key={tab.id}
                        label={tab.label}
                        isActive={activeTab === tab.id}
                        onClick={() => setActiveTab(tab.id)}
                    />
                ))}
            </Flex>

            <Flex direction="row">
                {ribbonConfiguration[activeTab].map((panel, index) => (
                    <RibbonPanel key={index} title={panel.title}>
                        {panel.buttons.map((button, btnIndex) => (
                            <RibbonButton
                                key={btnIndex}
                                icon={button.icon}
                                label={button.label}
                                onClick={button.onClick}
                                isActive={button.isActive}
                            />
                        ))}
                    </RibbonPanel>
                ))}
                <Flex>
                    <DrawingModify
                        activeObject={activeObject}
                        activeTab={activeTab}
                        activeCanvas={activeCanvas}
                        activeTool={activeTool}
                        currentBrush={currentBrush}
                        onCanvasChange={setActiveCanvas}
                        onToolChange={setActiveTool}
                        setBrush={setActiveBrush}
                    ></DrawingModify>
                    <WallModifier
                        activeObject={activeObject}
                        activeCanvas={activeCanvas}
                        activeTool={activeTool}
                        onCanvasChange={setActiveCanvas}
                        onToolChange={setActiveTool}
                        setActiveSketchTool={setActiveSketchTool}
                        activeSketchTool={activeSketchTool}>
                    </WallModifier>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default RibbonMenu;