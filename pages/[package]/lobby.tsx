import Head from "next/head";

import React from "react";
import PageWithLayoutType from "@/types/pageWithLayout";

import Default from "@/layouts/default";
import { Box, Flex, Progress, Spinner, Text } from "@chakra-ui/react";
import { HiOutlineExclamation } from "react-icons/hi";

const Lobby: React.FC = () => {
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

(Lobby as PageWithLayoutType).layout = Default;

export default Lobby;
