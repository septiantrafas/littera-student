import React, { useEffect } from "react";

import {
  useColorMode,
  useColorModeValue as mode,
  IconButton,
  Button,
  Flex,
  Box,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { Logo } from "@/components/Logo";
import { TimeKeeper } from "@/components/TimeKeeper";
import { HiMoon, HiSun } from "react-icons/hi";
import { Auth } from "@supabase/ui";
import useSWR from "swr";
import { useRouter } from "next/router";

type LayoutProps = {
  children: React.ReactNode;
};

const fetcher = (url, token) =>
  fetch(url, {
    method: "GET",
    headers: new Headers({ "Content-Type": "application/json", token }),
    credentials: "same-origin",
  }).then((res) => res.json());

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  // const { colorMode, toggleColorMode } = useColorMode();
  const { user, session } = Auth.useUser();
  const router = useRouter();
  const { isFallback } = useRouter();

  const { data, error } = useSWR(
    session ? ["/api/getUser", session.access_token] : null,
    fetcher
  );

  if (isFallback) {
    return (
      <Flex w="full" minH="100vh" justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Flex>
    );
  }

  if (!user) {
    return (
      <>
        <Flex
          direction="column"
          h="100vh"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="2xl" fontWeight="bold">
            Unauthorized Access
          </Text>
          <Button
            mt="3"
            variant="link"
            colorScheme="blue"
            onClick={() => router.push("/auth/signin")}
          >
            Sign in
          </Button>
        </Flex>
      </>
    );
  }

  return (
    <Box height="100vh" bg="white">
      <Flex
        bg="white"
        boxShadow="sm"
        position="relative"
        justifyContent="space-between"
        alignItems="center"
        direction="row"
        p="2"
        borderBottomWidth="1px"
      >
        <Logo ml="2" h="4" iconColor="gray.900" />
        <Flex alignItems="center">
          <TimeKeeper />
        </Flex>
      </Flex>
      {children}
    </Box>
  );
};

export default Layout;
