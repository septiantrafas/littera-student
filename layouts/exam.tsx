import React from "react";
import NextLink from "next/link";

import {
  useColorMode,
  useColorModeValue as mode,
  IconButton,
  Flex,
  Box,
} from "@chakra-ui/react";
import { Logo } from "@/components/Logo";
import { HiMoon, HiSun } from "react-icons/hi";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box bg={mode("white", "gray.800")}>
      <Flex
        position="relative"
        justifyContent="space-between"
        alignItems="center"
        direction="row"
        p="4"
        borderBottom="1px"
        borderColor={mode("gray.200", "transparent")}
      >
        <Logo h="6" iconColor={mode("gray.900", "gray.200")} />

        <IconButton
          aria-label={
            colorMode === "light" ? "Toggle dark mode" : "Toggle light mode"
          }
          icon={colorMode === "light" ? <HiMoon /> : <HiSun />}
          onClick={toggleColorMode}
        />
      </Flex>
      {children}
    </Box>
  );
};

export default Layout;
