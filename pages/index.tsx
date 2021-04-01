import Head from "next/head";
import React from "react";
import NextLink from "next/link";
import PageWithLayoutType from "@/types/pageWithLayout";
import Default from "@/layouts/default";
import { Flex, Heading, chakra, Text, Link, Box } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { supabase } from "utils/initSupabase";

type PackageRouteResponse = {
  id: string;
  package: { id: string };
};

type IHomeProps = {
  paths: PackageRouteResponse[];
};

const Home: React.FC<IHomeProps> = ({ paths }) => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex
        direction="column"
        h="70vh"
        alignItems="center"
        justifyContent="center"
      >
        <Heading size="4xl">
          Welcome to <chakra.a color="cyan.500">Littera</chakra.a>
        </Heading>

        <Text fontSize="2xl" mt="2">
          Get started by signing up{" "}
          <NextLink href="/auth/signin">
            <Link color="cyan.500">here</Link>
          </NextLink>
        </Text>

        <Box p="4" mt="10" borderWidth="1px" borderRadius="md">
          <Text>List of all packages:</Text>
          {paths.map((path) => (
            <NextLink
              href={{
                pathname: "/[package]/[section]",
                query: {
                  package: path.package.id,
                  section: path.id,
                },
              }}
            >
              <Link color="cyan.500">{path.package.id}</Link>
            </NextLink>
          ))}
        </Box>
      </Flex>
    </div>
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
    .order("number", { ascending: true })
    .limit(1);

  const data = res.data;
  // Pass data to the page via props
  return {
    props: {
      paths: data,
    },
  };
};

(Home as PageWithLayoutType).layout = Default;

export default Home;
