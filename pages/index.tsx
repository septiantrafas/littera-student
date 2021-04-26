import Head from "next/head";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import PageWithLayoutType from "@/types/pageWithLayout";
import Default from "@/layouts/default";
import {
  Flex,
  Heading,
  chakra,
  Text,
  Link,
  Box,
  Button,
  Skeleton,
  Img,
  Input,
  useToast,
} from "@chakra-ui/react";
import { GetServerSideProps, GetStaticProps } from "next";
import { supabase } from "utils/initSupabase";
import useSWR from "swr";
import { Auth } from "@supabase/ui";
import {
  HiArrowRight,
  HiHome,
  HiLogout,
  HiOutlineLogout,
  HiPhone,
} from "react-icons/hi";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { stat } from "fs/promises";

type PackageRouteResponse = {
  id: string;
  start_time: string;
  package: {
    id: string;
    name: string;
    organization: {
      name: string;
      address: string;
      phone: string;
    };
  };
};

type IHomeProps = {
  paths: PackageRouteResponse[];
};

const fetcher = (url, token) =>
  fetch(url, {
    method: "GET",
    headers: new Headers({ "Content-Type": "application/json", token }),
    credentials: "same-origin",
  }).then((res) => res.json());

const Home: React.FC<IHomeProps> = ({ paths }) => {
  const router = useRouter();
  const toast = useToast();
  const { user, session } = Auth.useUser();

  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);

  const { data, error } = useSWR(
    session ? ["/api/getUser", session.access_token] : null,
    fetcher
  );

  const handleMagicLink = async (email) => {
    try {
      const { user, session, error } = await supabase.auth.signIn({
        email: email,
      });

      if (error) {
        toast({
          title: error.name,
          status: "error",
          description: error.message,
          position: "top-right",
          duration: 5000,
          isClosable: true,
        });

        setLoading(false);
      } else if (!user) {
        toast({
          title: "Success",
          status: "success",
          position: "top-right",
          description: "Email konfirmasi terkirim",
          isClosable: true,
        });

        setLoading(false);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  if (!user) {
    return (
      <>
        <Flex direction="column" h="80vh" justifyContent="center">
          <Flex direction="column" maxW="2xl" ml="6">
            <Text
              maxW="3xl"
              letterSpacing="-0.025em"
              fontSize="6xl"
              color="gray.800"
              fontWeight="extrabold"
              lineHeight="1"
            >
              Penilaian Holistik untuk Institusi{" "}
              <chakra.a color="gray.800">Akademik</chakra.a> dan{" "}
              <chakra.a color="gray.800">Korporasi</chakra.a>
            </Text>

            <Flex mt="8">
              <Input
                maxW="40%"
                mr="3"
                placeholder="Email"
                borderRadius="lg"
                shadow="base"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                maxW="25%"
                boxShadow="lg"
                bg="gray.800"
                color="white"
                _hover={{
                  bg: "gray.700",
                  color: "white",
                }}
                rightIcon={<HiArrowRight />}
                isLoading={isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  setLoading(true);
                  handleMagicLink(email);
                }}
                // onClick={() => router.push("/auth/signin")}
              >
                Ikuti asesmen
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </>
    );
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex
        direction="column"
        ml="6"
        minH="90vh"
        justifyContent="center"
        alignItems="center"
      >
        <Box maxW="40%">
          <Box alignItems="flex-end" mb="6">
            <Heading size="lg">Halo! 👋</Heading>
            <Skeleton mt="1" isLoaded={data && !error}>
              <Text color="gray.400">
                {data ? data.email + ", " : ""} kamu diundang untuk mengikuti:
              </Text>
            </Skeleton>
          </Box>

          {paths.map((path) => (
            <Box
              key={path.package.id}
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="lg"
              shadow="md"
              bg="white"
              p="6"
            >
              <Heading fontSize="2xl">{path.package.name}</Heading>
              <Text color="gray.400">By {path.package.organization.name}</Text>
              <Text color="gray.400">
                Dimulai pada{" "}
                {dayjs(path.start_time).format("DD MMM YYYY - HH:mm")}
              </Text>
              <Flex alignItems="center">
                <HiHome />
                <Text ml="2">{path.package.organization.address}</Text>
              </Flex>
              <Flex alignItems="center">
                <HiPhone />
                <Text ml="2">{path.package.organization.phone}</Text>
              </Flex>
              <Flex w="full" justifyContent="flex-end">
                <NextLink
                  href={{
                    pathname: "/[package]/[section]",
                    query: {
                      package: path.package.id,
                      section: path.id,
                    },
                  }}
                  passHref
                >
                  <Button
                    mt="4"
                    size="sm"
                    rightIcon={<HiArrowRight />}
                    colorScheme="blue"
                  >
                    Ikuti Asesmen
                  </Button>
                </NextLink>
              </Flex>
            </Box>
          ))}
          <Flex direction="column" mt="4">
            <Button
              variant="link"
              size="sm"
              onClick={() => supabase.auth.signOut()}
            >
              Keluar
            </Button>
          </Flex>
        </Box>
      </Flex>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const query = `
  id,
  start_time,
  package:package_id (
    id,
    name,
    organization:organization_id (
      name,
      address,
      phone
    )
  )
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
