import { RibbonTabProps } from ".";
import { Button, Flex, Text } from "@radix-ui/themes";

export const RibbonTab: React.FC<RibbonTabProps> = ({ label, isActive, onClick }) => (
    <Flex>
        <div
            onClick={onClick}
            style={{
                background: isActive ? "#cefddf" : "none",
                padding: '2px 16px',
                cursor: 'pointer'
            }}
        >
            <Text
                size="1"
            >
                {label}
            </Text>
        </div>
        <div style={{ background: "currentcolor", opacity: 0.15, width: "1px" }}></div>
    </Flex>
);