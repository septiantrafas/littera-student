import Head from "next/head";
import React from "react";
import NextLink from "next/link";
import PageWithLayoutType from "@/types/pageWithLayout";
import Default from "@/layouts/default";
import { Flex, Heading, chakra, Text, Link } from "@chakra-ui/react";
import { GetServerSideProps } from "next";

const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex direction="column" alignItems="center">
        <Heading size="4xl">
          Welcome to <chakra.a color="cyan.500">Littera</chakra.a>
        </Heading>

        <Text fontSize="xl" mt="2">
          Get started by signing up{" "}
          <NextLink href="/auth/signin">
            <Link color="cyan.500">here</Link>
          </NextLink>
        </Text>
      </Flex>
    </div>
  );
};

(Home as PageWithLayoutType).layout = Default;

export default Home;
