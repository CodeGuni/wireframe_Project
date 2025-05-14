import { Flex, Text } from '@radix-ui/themes';
import React from 'react';

interface BottomBarProps {
    scale: number;
    onUndo?: () => void;
    onRedo?: () => void;
    onSave?: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
    scale,
    // onUndo,
    // onRedo,
    // onSave
}) => {
    return (
        <Flex direction={"row"} align={"center"} gap={"1"} style={{ padding: "0.5rem" }}>
            {/* Left: Display current scale */}
            <div className="flex-grow">
                <Text size={"1"}>Scale: {scale.toFixed(2)}</Text>
            </div>
        </Flex>
    );
};

export default BottomBar;
