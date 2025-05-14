import { Flex, Text } from '@radix-ui/themes';
import { RibbonPanelProps } from './index';

export const RibbonPanel: React.FC<RibbonPanelProps> = ({ title, children }) => (
    <Flex gap="1" direction="column" style={{
        marginTop: "0.25rem",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        paddingBottom: "1rem",
    }}>
        <Text size="1" align="center" style={{ color: "Highlight" }}>{title}</Text>
        <Flex gap="1" direction="row">{children}</Flex>
    </Flex>
);