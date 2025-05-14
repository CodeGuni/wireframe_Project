import { Flex, Text } from "@radix-ui/themes";
import { BrushBase } from "../../types/drawing";
import { Slider } from "./../ui/Slider";

export const SizePanel: React.FC<{
    currentBrush: BrushBase
    setBrush: (brush: BrushBase) => void;
}> = ({ currentBrush, setBrush }) => {

    return (
        <Flex gap="1" direction="column" style={{ border: "black", width: "150px", verticalAlign: "middle" }}>
            <Text className="text-xs text-gray-500 mb-1">Size</Text>
            <Flex className="flex items-center">
                <Slider
                    className="w-48"
                    min={1}
                    max={currentBrush.size + 20}
                    step={1}
                    value={[currentBrush.size]}
                    onValueChange={(value) => setBrush({ ...currentBrush, size: value[0] })}
                />
                <Text className="text-xs text-gray-500 w-8">{currentBrush.size}px</Text>
            </Flex>
        </Flex>
    );
};