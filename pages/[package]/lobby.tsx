import Head from "next/head";

import React, { useEffect, useState } from "react";
import PageWithLayoutType from "@/types/pageWithLayout";

import Default from "@/layouts/default";
import { Box, Flex, Progress, Spinner, Text } from "@chakra-ui/react";
import { HiOutlineExclamation } from "react-icons/hi";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { supabase } from "utils/initSupabase";
import { useRouter } from "next/router";
import { UrlObject } from "url";

type ILobbyProps = {
  paths: {
    id: string;
    package: { id: string };
  };
};

type ILobbyStaticPaths = {
  id: string;
  packages: { id: string };
};

type LobbyState = {
  isEligible: boolean;
  redirectPath: string | UrlObject;
};

const Lobby: React.FC<ILobbyProps> = ({ paths }) => {
  const router = useRouter();
  const isDevelopment = process.env.NEXT_PUBLIC_ENVIRONMENT === "development";

  const [{ isEligible, redirectPath }, setState] = useState<LobbyState>({
    isEligible: false,
    redirectPath: "/verification",
  });

  const [progress, setProgress] = useState(10);
  const [status, setStatus] = useState("Establishing connection...");

  useEffect(() => {
    if (isEligible) {
      setState((prevState) => {
        return {
          ...prevState,
          redirectPath: {
            pathname: "/[package]/[section]",
            query: {
              package: paths.package.id,
              section: paths.id,
            },
          },
        };
      });
    }
  }, [isEligible]);

  // useEffect(() => {
  //   if (isStarted) {
  //     router.push(redirectPath)
  //   }
  // }, [isStarted])

  useEffect(() => {
    if (isDevelopment) {
      setTimeout(() => {
        setStatus("Checking your internet speed...");
        setProgress(20);
      }, 5000);

      setTimeout(() => {
        setStatus("Checking your hardware...");
        setProgress(40);
      }, 10000);

      setTimeout(() => {
        setStatus("Verifying your identity...");
        setProgress(60);
      }, 15000);

      setTimeout(() => {
        setStatus("Preparing test environment...");
        // TODO: Set browser to full-screen
        setProgress(80);
      }, 20000);

      setTimeout(() => {
        setStatus("Waiting for test to start");
        setProgress(100);
      }, 25000);

      setTimeout(() => {
        router.push({
          pathname: "/[package]/[section]",
          query: {
            package: paths.package.id,
            section: paths.id,
          },
        });
      }, 35000);
    }
  }, []);

  return (
    <>
      <Box maxW="100%" textAlign="center" overflow="hidden" m="10" p="10">
        <Flex justifyContent="center" color="red.500">
          <HiOutlineExclamation size="200" />
        </Flex>
        <Box mx="auto" maxW="3xl">
          <Text
            color="red.500"
            fontSize="4xl"
            fontWeight="semibold"
            lineHeight="10"
          >
            Changing window or tab during an exam may result in disqualification
            by our system!
          </Text>
          <Text color="red.500" mt="4">
            We work hard to make sure the integrity of your results really
            indicates your level of ability.
          </Text>
          <Box mt="20">
            <Text fontSize="xl">{status}</Text>
            <Progress
              w="80%"
              mt="5"
              colorScheme="twitter"
              mx="auto"
              hasStripe
              value={progress}
              isAnimated
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `
  id,
  package:package_id (id)
  `;

  const res = await supabase
    .from<any>("sections")
    .select(query)
    .match({ package_id: params.package.toString() })
    .order("number", { ascending: true })
    .limit(1);

  const data = res.data[0];
  // Pass data to the page via props
  return {
    props: {
      paths: data,
    },
    revalidate: 3600,
  };
};

(Lobby as PageWithLayoutType).layout = Default;

export default Lobby;
