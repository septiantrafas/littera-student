import React from "react";
import PageWithLayoutType from "@/types/pageWithLayout";

import Authenticated from "@/layouts/authenticated";
import { Auth } from "@supabase/ui";
import { supabase } from "utils/initSupabase";

import NextLink from "next/link";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Img,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { LogoAlt } from "@/components/LogoAlt";
import { useRouter } from "next/router";

const Signin: React.FC = () => {
  const router = useRouter();
  return (
    <Flex height="100vh" overflowY="hidden">
      <Box
        w={{ base: "100%", lg: "40%", xl: "35%" }}
        py="10"
        px={{ sm: "6", lg: "8" }}
      >
        <Box maxW={{ sm: "md" }} w={{ sm: "full" }} mx="auto">
          <Box px={{ base: "4" }}>
            <LogoAlt
              h="10"
              onClick={() => router.push("/")}
              iconColor={mode("gray.900", "gray.200")}
              cursor="pointer"
            />

            <Heading
              mt="6"
              textAlign="left"
              size="xl"
              fontWeight="extrabold"
              lineHeight="1"
            >
              Sign in to your account
            </Heading>
            <Text mt="4" align="left" maxW="md" fontWeight="medium">
              <span>Don&apos;t have an account?</span>
              <Box
                as="a"
                marginStart="1"
                href="#"
                color={mode("blue.600", "blue.300")}
                _hover={{ color: mode("blue.800", "blue.400") }}
                display={{ base: "block", sm: "revert" }}
              >
                Start free trial
              </Box>
            </Text>
          </Box>
        </Box>
        <Stack mt="8" direction="row" alignItems="center">
          <Divider mr="2" />
          <Text mr="2" fontSize="sm" fontWeight="semibold" color="gray.300">
            OR
          </Text>
          <Divider />
        </Stack>
        <Box maxW={{ sm: "md" }} w={{ sm: "full" }} mx="auto">
          <Box px={{ base: "4" }}>
            <Auth supabaseClient={supabase} view="magic_link" />
          </Box>
        </Box>
      </Box>
      <Box display={{ base: "none", lg: "block" }} w="65%">
        <Img
          minH="100vh"
          minW="100vh"
          objectFit="cover"
          src="https://source.unsplash.com/_ar2ENzmqb0/1920x1080"
          filter={mode(
            "grayscale(0%) brightness(98%)",
            "grayscale(100%) brightness(70%)"
          )}
          alt="Login Image"
        />
      </Box>
    </Flex>
  );
};

(Signin as PageWithLayoutType).layout = Authenticated;

export const getStaticProps = async () => {
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};

export default Signin;
