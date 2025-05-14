import React from 'react';
import { ToolId } from '../../types';

interface ToolButtonProps {
    tool: ToolId;
    active: boolean;
    icon: React.ReactNode;
    onClick: () => void;
}

export const ToolButton: React.FC<ToolButtonProps> = ({
    tool,
    active,
    icon,
    onClick
}) => {
    return (
        <button
            className={`p-2 rounded ${active ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
            onClick={onClick}
            title={tool.charAt(0).toUpperCase() + tool.slice(1)}
        >
            {icon}
        </button>
    );
};