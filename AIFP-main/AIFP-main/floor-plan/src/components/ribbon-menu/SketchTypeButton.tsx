import { Button, Flex } from "@radix-ui/themes";
import { RibbonButtonProps } from ".";
import { useState } from "react";

export const SketchTypeButton: React.FC<RibbonButtonProps> = ({ icon: Icon, label, onClick, isActive }) => {
    const [onHover, setHover] = useState(false);
    return (
        <Button color="gray"
            onClick={onClick}
            className={"rounded-none"}
            style={{
                backgroundColor: (isActive || onHover) ? "rgb(0 187 40 / 50%)" : "rgb(0 187 40 / 3%)",
                width: "24px",
                height: "24px",
                borderWidth: "1px",
                borderColor: (isActive || onHover) ? "rgb(0 187 40 / 100%)" : "rgb(0 0 0 / 0%)",
                borderStyle: 'solid'
            }}
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            title={label}
        >
            <Flex direction="row" align="center" style={{ color: "paleturquoise" }}>
                {Icon && <Icon size={16} style={{ color: "#1F1F1F" }} />}
            </Flex>
        </Button>
    );
};