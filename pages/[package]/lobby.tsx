import Head from "next/head";

import React, { useEffect } from "react";
import PageWithLayoutType from "@/types/pageWithLayout";

import Default from "@/layouts/default";
import { Box, Flex, Progress, Spinner, Text } from "@chakra-ui/react";
import { HiOutlineExclamation } from "react-icons/hi";
import { GetServerSideProps } from "next";
import { supabase } from "utils/initSupabase";
import { useRouter } from "next/router";

type ILobbyProps = {
  paths: {
    id: string;
    package: { id: string };
  };
};

const Lobby: React.FC<ILobbyProps> = ({ paths }) => {
  const router = useRouter();

  useEffect(() => {
    console.log(paths);
    setTimeout(() => {
      router.push({
        pathname: "/[package]/[section]",
        query: {
          package: paths.package.id,
          section: paths.id,
        },
      });
    }, 5000);
    // return () => {
    //   cleanup
    // }
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
            <Text fontSize="xl">Verifying your identity..</Text>
            <Progress
              w="80%"
              mt="5"
              colorScheme="twitter"
              mx="auto"
              hasStripe
              value={20}
              isAnimated
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = `
  id,
  package:package_id (id)
  `;

  const res = await supabase
    .from<any>("sections")
    .select(query)
    .match({ package_id: context.params.package.toString() })
    .order("number", { ascending: true })
    .limit(1);

  const data = res.data[0];
  // Pass data to the page via props
  return {
    props: {
      paths: data,
    },
  };
};

(Lobby as PageWithLayoutType).layout = Default;

export default Lobby;
