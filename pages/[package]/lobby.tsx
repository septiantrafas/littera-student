import React, { useEffect, useState } from "react";
import PageWithLayoutType from "@/types/pageWithLayout";

import Default from "@/layouts/default";
import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Text,
  useToast,
} from "@chakra-ui/react";
import { GetStaticPaths, GetStaticProps } from "next";
import { supabase } from "utils/initSupabase";
import { useRouter } from "next/router";
import { UrlObject } from "url";
import { useNavigationStore } from "providers/RootStoreProvider";
import dynamic from "next/dynamic";
import screenfull from "screenfull";
import { HiOutlineRefresh } from "react-icons/hi";
import { Auth } from "@supabase/ui";

const LordIcon = dynamic(() => import("@/components/LordIcon"), {
  ssr: false,
});

type ILobbyProps = {
  paths: {
    id: string;
    package: { id: string };
  };
};

interface ISectionUrl {
  pathname: string;
  query?: {
    package: string;
    section: string;
  };
}

const Lobby: React.FC<ILobbyProps> = (props) => {
  const { paths } = props;

  const toast = useToast();
  const router = useRouter();
  const { user, session } = Auth.useUser();
  const navigation = useNavigationStore();
  const isDevelopment = process.env.NEXT_PUBLIC_ENVIRONMENT === "development";

  const [isEligible, setEligible] = useState(false);
  const [redirectPath, setRedirectPath] = useState<ISectionUrl>({
    pathname: "/[package]/[section]",
    query: {
      package: paths.package.id,
      section: paths.id,
    },
  });

  const [progress, setProgress] = useState(10);
  const [status, setStatus] = useState("Menunggu akses diberikan...");
  const [icon, setIcon] = useState("/icons/error.json");
  const [isFullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (navigation.CURRENT_PATH) {
      const params = navigation.CURRENT_PATH.params;
      router.prefetch(
        `/${encodeURI(params.package)}/${encodeURI(params.section)}`
      );
    } else {
      const query = redirectPath.query;
      router.prefetch(
        `/${encodeURI(query.package)}/${encodeURI(query.section)}`
      );
    }

    if (isEligible === false && user) {
      (async () => {
        const res = await supabase
          .from("participants")
          .select(`id, profile_id`)
          .match({ profile_id: user.id });

        if (res.data.length) setEligible(true);
      })();
    }
  }, [isEligible, navigation, redirectPath, router, user]);

  useEffect(() => {
    if (isDevelopment && paths && isFullScreen && user) {
      let timer = setInterval(() => {
        setProgress(progress + 5);
        console.log(progress);
      }, 1000);

      switch (progress) {
        case 10:
          setIcon("/icons/globe.json");
          setStatus("memastikan kestabilan internet...");
          break;
        case 20:
          setIcon("/icons/lcd-display.json");
          setStatus("mengecek akses perangkat...");
          break;
        case 30:
          setIcon("/icons/fingerprint.json");
          setStatus("memverifikasi identitas...");

          if (isEligible === false) {
            setIcon("/icons/fingerprint.json");
            setStatus("Maaf anda tidak berhak mengikuti tes");

            clearInterval(timer);

            toast({
              id: "is_not_eligible",
              title: "Peringatan",
              description: "Maaf anda tidak berhak mengikuti tes",
              status: "error",
              duration: 2000,
              isClosable: true,
              position: "top",
            });

            setTimeout(() => {
              router.push("/");
            }, 3000);

            return () => {
              clearTimeout();
            };
          }
          break;

        case 40:
          setIcon("/icons/eye.json");
          setStatus("mempersiapkan lingkungan tes...");

          break;
        case 50:
          setIcon("/icons/conference.json");
          setStatus("mengakses ruangan tes...");
          break;
        case 100:
          setIcon("/icons/clock.json");
          setStatus("menunggu jadwal tes dimulai...");

          // TODO: Change redirect path using navigationStore.current_path
          console.log("redirectPath:", JSON.stringify(redirectPath));

        // if (navigation.CURRENT_PATH) {
        //   const params = navigation.CURRENT_PATH.params;
        //   router.push({
        //     pathname: "/[package]/[section]",
        //     query: {
        //       package: params.package,
        //       section: params.section,
        //     },
        //   });
        // } else {
        //   router.push(redirectPath);
        // }
      }

      if (progress === 100) {
        clearInterval(timer);
      }

      return () => {
        if (timer) {
          clearInterval(timer);
        }

        navigation.setFirstEntryState(true);
      };
    } else if (isDevelopment && paths && !isFullScreen) {
      setIcon("/icons/error.json");
      setStatus("Menunggu akses diberikan...");
    }
  }, [
    isDevelopment,
    isEligible,
    isFullScreen,
    navigation,
    paths,
    progress,
    redirectPath,
    router,
    toast,
    user,
  ]);

  useEffect(() => {
    if (screenfull.isEnabled) {
      screenfull.on("change", () => {
        setFullScreen(screenfull.isEnabled ? screenfull.isFullscreen : false);
      });
    }
  });

  return (
    <>
      <Flex
        pos="relative"
        direction="column"
        maxW="100%"
        minH="90vh"
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
      >
        {!isFullScreen && (
          <Box
            pos="absolute"
            top="0"
            bgColor="red.50"
            p="4"
            mt="6"
            rounded="xl"
          >
            <Text maxW="lg" color="red.500">
              <Text as="span" color="red.600" fontWeight="bold">
                PERHATIAN:
              </Text>{" "}
              Tes ini membutuhkan akses layar untuk memulai, sistem tidak akan
              berjalan apabila akses layar belum diberikan.
            </Text>
          </Box>
        )}

        <Flex justifyContent="center" opacity="50%">
          <LordIcon url={icon} />
        </Flex>

        <Flex
          direction="column"
          textAlign="left"
          mx="auto"
          maxW="3xl"
          alignItems="center"
        >
          <Text
            color="blueGray.700"
            fontSize="4xl"
            lineHeight="10"
            fontWeight="bold"
          >
            {!isFullScreen ? "Meminta akses layar" : "Harap Tunggu"}
          </Text>
          <Text
            color="blueGray.600"
            fontSize="2xl"
            lineHeight="10"
            className="pulse"
          >
            {status}
          </Text>

          {isFullScreen ? null : (
            <Button
              onClick={() => {
                setFullScreen(true);
                if (screenfull.isEnabled) {
                  screenfull.request();
                }
              }}
              colorScheme="blue"
              mt="6"
              rightIcon={<HiOutlineRefresh />}
            >
              Berikan izin pada layar
            </Button>
          )}

          {isFullScreen && (
            <Box bgColor="blue.50" p="4" mt="6" rounded="xl">
              <Text maxW="lg" color="blue.600">
                <Text as="span" color="blue.700" fontWeight="bold">
                  Info:
                </Text>{" "}
                Halaman ini akan beralih dengan sendirinya. Jangan lupa
                mengerjakan tes sesuai dengan peraturan.
              </Text>
            </Box>
          )}
        </Flex>
      </Flex>
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
  // TODO: Implement static type for supabase response
  let data = null;

  const query = `
  id,
  package:package_id (id)
  `;

  try {
    const res = await supabase
      .from<any>("sections") // TODO: Implement static type for supabase response
      .select(query)
      .match({ package_id: params.package.toString() })
      .order("number", { ascending: true })
      .limit(1);

    data = res.data[0];
  } catch (error) {
    console.error("response error:", error);
    return { notFound: true };
  }

  // Pass data to the page via props
  try {
    return {
      props: {
        paths: data,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};

(Lobby as PageWithLayoutType).layout = Default;

export default Lobby;
