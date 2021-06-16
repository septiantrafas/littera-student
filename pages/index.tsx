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
  Box,
  Button,
  Skeleton,
  Input,
  useToast,
} from "@chakra-ui/react";
import { supabase } from "utils/initSupabase";
import useSWR from "swr";
import { Auth } from "@supabase/ui";
import { HiArrowRight, HiLogout } from "react-icons/hi";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { RequirementCheck } from "@/components/RequirementCheck";

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

const fetcher = (url, token) =>
  fetch(url, {
    method: "GET",
    headers: new Headers({ "Content-Type": "application/json", token }),
    credentials: "same-origin",
  }).then((res) => res.json());

const Home: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const { user, session } = Auth.useUser();

  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);

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

  useEffect(() => {
    const handleAsync = async () => {
      if (user) {
        const query = `
        id,
        schedule:schedule_id (
          name,
          exam_date,
          url,
          package_id
        )
        `;
        const res = await supabase
          .from<any>("participants")
          .select(query)
          .match({ profile_id: user.id });

        if (res.data.length) {
          setSchedules(res.data);
        }
      }
    };
    handleAsync();
  }, [user]);

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

      <Flex minH="90vh" w="full" justifyContent="center" mt="6">
        <Flex maxW={{ base: "full", "2xl": "5xl" }} mx="6">
          <RequirementCheck />
          <Box w="50%" mx="8">
            <Box alignItems="flex-end" mb="6">
              <Heading size="lg">Jadwal</Heading>
              <Skeleton mt="1" isLoaded={data && !error}>
                <Text color="gray.400">
                  {data ? data.email + ", " : ""} kamu diundang untuk mengikuti:
                </Text>
              </Skeleton>
            </Box>

            {!schedules.length && (
              <Box py="20" px="4" bg="gray.100" borderRadius="lg">
                <Text color="gray.400" textAlign="center">
                  No Invite
                </Text>
              </Box>
            )}
            {schedules &&
              schedules.map(({ schedule }) => (
                <Box
                  key={schedule.name}
                  borderWidth="1px"
                  borderColor="gray.200"
                  borderRadius="lg"
                  bg="white"
                  p="6"
                >
                  <Heading fontSize="2xl">{schedule.name}</Heading>
                  <Text color="gray.400">
                    Dimulai pada{" "}
                    {dayjs(schedule.exam_date).format("DD MMM YYYY - HH:mm")}
                  </Text>
                  <Flex mt="4">
                    <NextLink
                      href={`/${encodeURIComponent(schedule.package_id)}/lobby`}
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
                size="sm"
                variant="ghost"
                colorScheme="red"
                rightIcon={<HiLogout />}
                onClick={() => supabase.auth.signOut()}
              >
                Keluar
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </div>
  );
};

(Home as PageWithLayoutType).layout = Default;

export default Home;
