import { BrushBase } from "../../types/drawing";
import { Popover, PopoverContent, PopoverTrigger } from './Popover'

export const ColorPanel: React.FC<{
    currentBrush: BrushBase
    setBrush: (brush: BrushBase) => void;
}> = ({ currentBrush, setBrush }) => {
    const colors = [
        '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
        '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#800000',
        '#808000', '#008080', '#000080', '#FFC0CB', '#A52A2A', '#808080'
    ];

    return (
        <div className="flex flex-col border-gray-200 p-2">
            <div className="text-xs text-gray-500 mb-1">Color</div>
            <div className="flex items-center">
                <Popover>
                    <PopoverTrigger asChild>
                        <button
                            className="w-8 h-8 rounded border border-gray-200"
                            style={{ backgroundColor: currentBrush.color }}
                        />
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2">
                        <div className="grid grid-cols-6 gap-1">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                    onClick={() => setBrush({ ...currentBrush, color })}
                                />
                            ))}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <input
                                type="color"
                                value={currentBrush.color}
                                onChange={(e) => setBrush({ ...currentBrush, color: e.target.value })}
                                className="w-full h-8"
                            />
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};