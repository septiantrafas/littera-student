import React, { useEffect, useState } from "react";

import {
  useColorMode,
  useColorModeValue as mode,
  IconButton,
  Button,
  Flex,
  Box,
  Text,
  Spinner,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@chakra-ui/react";
import { Logo } from "@/components/Logo";
import { TimeKeeper } from "@/components/TimeKeeper";
import { HiMoon, HiOutlineQuestionMarkCircle, HiSun } from "react-icons/hi";
import { Auth } from "@supabase/ui";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useNavigationStore } from "providers/RootStoreProvider";
import screenfull from "screenfull";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigation = useNavigationStore();
  const [isFullScreen, setFullScreen] = useState(false);

  const { user, session } = Auth.useUser();
  const router = useRouter();
  const { isFallback } = useRouter();

  const { data, error } = useSWR(
    session ? ["/api/getUser", session.access_token] : null,
    fetcher
  );

  useEffect(() => {
    if (screenfull.isEnabled) {
      screenfull.on("change", () => {
        setFullScreen(screenfull.isEnabled ? screenfull.isFullscreen : false);
      });
    }
  });

  useEffect(() => {
    if (screenfull.isEnabled) {
      setFullScreen(screenfull.isFullscreen);
    }
  }, []);

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
          {navigation.getCurrentInstruction() ? (
            <>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={onOpen}
                leftIcon={<HiOutlineQuestionMarkCircle />}
                variant="outline"
              >
                Instruksi
              </Button>
              <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerHeader borderBottomWidth="1px">
                    Instruksi dan Contoh Soal
                  </DrawerHeader>
                  <DrawerBody>
                    <Text my="4">{navigation.getCurrentInstruction()}</Text>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </>
          ) : null}
        </Flex>
      </Flex>
      {isFullScreen ? (
        children
      ) : (
        <Flex
          direction="column"
          minH="90vh"
          justifyContent="center"
          alignItems="center"
        >
          <Text>
            Anda harus dalam mode Fullscreen untuk dapat mengakses soal
          </Text>
          <Button
            mt="4"
            onClick={() => {
              if (screenfull.isEnabled) {
                setFullScreen(true);
                screenfull.request();
              }
            }}
          >
            Masuk ke mode Fullscreen
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default Layout;
