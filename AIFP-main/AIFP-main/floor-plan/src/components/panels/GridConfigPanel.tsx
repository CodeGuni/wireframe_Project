import React, { useState, useEffect, useCallback } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover';
import { Slider } from "../ui/Slider";
import { GridConfigPanelProps } from '.';

export const GridConfigPanel: React.FC<GridConfigPanelProps> = ({
    config,
    onConfigChange,
    panelManager
}) => {
    const [, setForceUpdate] = useState({});

    // Subscribe to panel state changes
    useEffect(() => {
        return panelManager.subscribe(() => setForceUpdate({}));
    }, [panelManager]);

    const panelState = panelManager.getPanelState('gridConfig');

    if (!panelState) return null;

    const unitOptions = [
        { value: 'metric', label: 'Metric (mm)' },
        { value: 'imperial', label: 'Imperial (inches)' }
    ];

    const colors = [
        '#CCCCCC', '#999999', '#666666', '#E0E0E0',
        '#A5A5A5', '#858585', '#D3D3D3', '#BEBEBE'
    ];

    return (
        <Popover
            open={panelState.isOpen}
            onOpenChange={(isOpen) => {
                if (isOpen) {
                    panelManager.openPanel('gridConfig');
                } else {
                    panelManager.closePanel('gridConfig');
                }
            }}
        >
            <PopoverTrigger asChild>
                <button ref={panelState.triggerRef} className="hidden" />
            </PopoverTrigger>
            <PopoverContent
                className="w-80 p-4 shadow-lg border rounded-lg bg-white"
                style={{
                    position: 'fixed',
                    left: panelState.position?.x ?? 0,
                    top: panelState.position?.y ?? 0,
                    transform: 'none'
                }}
            >
                {/* Drag Handle */}
                <div
                    className="drag-handle cursor-move h-6 bg-gray-100 rounded-t-lg mb-2 flex items-center justify-center -mt-4 -mx-4"
                    onMouseDown={(e) => {
                        const startX = e.clientX - (panelState.position?.x ?? 0);
                        const startY = e.clientY - (panelState.position?.y ?? 0);

                        const handleMouseMove = (e: MouseEvent) => {
                            panelManager.updatePanelPosition(
                                'gridConfig',
                                e.clientX - startX,
                                e.clientY - startY
                            );
                        };

                        const handleMouseUp = () => {
                            window.removeEventListener('mousemove', handleMouseMove);
                            window.removeEventListener('mouseup', handleMouseUp);
                        };

                        window.addEventListener('mousemove', handleMouseMove);
                        window.addEventListener('mouseup', handleMouseUp);
                    }}
                >
                    <div className="w-20 h-1 bg-gray-300 rounded-full" />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Show Grid</span>
                        <button
                            className={`w-8 h-5 rounded-full transition-colors ${config.enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                            onClick={() => onConfigChange({ enabled: !config.enabled })}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${config.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {/* Unit System */}
                    <div className="space-y-2">
                        <span className="text-sm font-medium">Unit System</span>
                        <div className="grid grid-cols-2 gap-2">
                            {unitOptions.map(option => (
                                <button
                                    key={option.value}
                                    className={`px-3 py-1 rounded text-sm ${config.unitSystem === option.value
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100'
                                        }`}
                                    onClick={() => onConfigChange({ unitSystem: option.value as 'metric' | 'imperial' })}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid Spacing */}
                    <div className="space-y-2">
                        <span className="text-sm font-medium">Grid Spacing</span>
                        <div className="flex items-center gap-2">
                            <Slider
                                value={[config.gridSize]}
                                onValueChange={([value]) => onConfigChange({ gridSize: value })}
                                min={config.unitSystem === 'metric' ? 10 : 0.5}
                                max={config.unitSystem === 'metric' ? 1000 : 48}
                                step={config.unitSystem === 'metric' ? 10 : 0.5}
                            />
                            <span className="text-sm w-16">
                                {config.gridSize}{config.unitSystem === 'metric' ? 'mm' : '"'}
                            </span>
                        </div>
                    </div>

                    {/* Line Thickness */}
                    <div className="space-y-2">
                        <span className="text-sm font-medium">Line Thickness</span>
                        <div className="flex items-center gap-2">
                            <Slider
                                value={[config.lineWidth]}
                                onValueChange={([value]) => onConfigChange({ lineWidth: value })}
                                min={0.1}
                                max={2}
                                step={0.1}
                            />
                            <span className="text-sm w-16">{config.lineWidth}px</span>
                        </div>
                    </div>

                    {/* Grid Color */}
                    <div className="space-y-2">
                        <span className="text-sm font-medium">Grid Color</span>
                        <div className="grid grid-cols-8 gap-1">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    className={`w-6 h-6 rounded border ${config.color === color ? 'border-blue-500' : 'border-gray-200'
                                        } hover:scale-110 transition-transform`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => onConfigChange({ color })}
                                />
                            ))}
                        </div>
                        <input
                            type="color"
                            value={config.color}
                            onChange={(e) => onConfigChange({ color: e.target.value })}
                            className="w-full h-8 mt-2"
                        />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};