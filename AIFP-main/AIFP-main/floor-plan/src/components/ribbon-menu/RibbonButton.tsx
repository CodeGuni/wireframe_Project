import { Button, Flex, Text } from "@radix-ui/themes";
import { RibbonButtonProps } from ".";
import { useState } from "react";

export const RibbonButton: React.FC<RibbonButtonProps> = ({ icon: Icon, label, onClick, isActive }) => {
    const [onHover, setHover] = useState(false);
    return (
        <Button color="gray"
            // className="rounded-none"
            onClick={onClick}
            style={{ 
                backgroundColor: (isActive || onHover) ? "#BDD1FF" : "#F0F0F0", 
                width: "64px", 
                height: "64px", 
                fontStyle: "normal",
                fontWeight: "normal",
                borderWidth: "1px",
                borderStyle: "solid",
             }}
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Flex direction="column" gap="1" align="center" style={{ color: "paleturquoise" }}>
                {Icon && <Icon size={20} style={{ color: "#1F1F1F" }} />}
                {label && <Text size={"1"} style={{ color: "#1F1F1F" }}>{label}</Text>}
            </Flex>
        </Button>
    );
};