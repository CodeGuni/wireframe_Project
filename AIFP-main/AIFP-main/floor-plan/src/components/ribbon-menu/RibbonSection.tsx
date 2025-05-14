import React from 'react';

interface RibbonSectionProps {
    title: string;
    children: React.ReactNode;
}

export const RibbonSection: React.FC<RibbonSectionProps> = ({ title, children }) => {
    return (
        <div className="flex flex-col items-center px-4 border-r border-gray-200">
            <div className="text-sm font-medium mb-2">{title}</div>
            <div className="flex gap-2">{children}</div>
        </div>
    );
};