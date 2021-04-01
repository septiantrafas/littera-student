import Head from "next/head";
// import Image from "next/image";

import React from "react";
import PageWithLayoutType from "@/types/pageWithLayout";

import Default from "@/layouts/default";
import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { HiOutlineVideoCamera, HiOutlineMicrophone } from "react-icons/hi";

const Permission: React.FC = () => {
  return (
    <>
      <Box maxW="100%" textAlign="center" overflow="hidden" p="5">
        <Box mx="auto" maxW="3xl" mt="4">
          <Text
            color="blue.600"
            fontSize="5xl"
            fontWeight="extrabold"
            lineHeight="1"
          >
            Test your equipment
          </Text>
          <Flex justifyContent="center" my="16">
            <Stack direction="row" spacing={20}>
              <Avatar
                w="2.5em"
                h="2.5em"
                bg="gray.100"
                color="gray.700"
                size="2xl"
                icon={<HiOutlineVideoCamera fontSize="1.75em" />}
              >
                <AvatarBadge
                  borderColor="green.100"
                  boxSize="1em"
                  bg="green.500"
                />
              </Avatar>

              <Avatar
                w="2.5em"
                h="2.5em"
                bg="gray.100"
                color="gray.700"
                size="2xl"
                icon={<HiOutlineMicrophone fontSize="1.75em" />}
              >
                <AvatarBadge
                  borderColor="papayawhip"
                  bg="tomato"
                  boxSize="1em"
                />
              </Avatar>
            </Stack>
            {/* <HiOutlineVideoCamera size="100" />
            <HiOutlineMicrophone size="100" /> */}
            {/* <Img src="https://www.howtogeek.com/wp-content/uploads/2019/04/2019-04-13_10h53_44.png" /> */}
          </Flex>
          <Text color="gray.500" fontSize="lg" lineHeight="6">
            LITTERA membutuhkan akses mikrofon dan kamera anda. Dengan akses ini
            sistem kami dapat mendeteksi tindakan-tindakan yang melanggar hukum.
            Pertimbangan mengenai hak dan privasi pengguna dapat anda lihat
            kembali <Link fontWeight="semibold">disini</Link>
          </Text>
        </Box>
      </Box>
    </>
  );
};

(Permission as PageWithLayoutType).layout = Default;

export default Permission;
