import { createContext, useContext } from 'react';
import { CanvasContextType, LayerManagerContextType } from '../types/canvas';

const CanvasContext = createContext<CanvasContextType | null>(null);
const LayerManagerContext = createContext<LayerManagerContextType | null>(null);

export const useCanvas = () => {
    const context = useContext(CanvasContext);
    if (!context) throw new Error('useCanvas must be used within a CanvasProvider');
    return context;
};

export const useLayerManager = () => {
    const context = useContext(LayerManagerContext);
    if (!context) throw new Error('useLayerManager must be used within a LayerManagerProvider');
    return context;
};