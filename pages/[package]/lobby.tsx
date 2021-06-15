import React, { useEffect, useState } from "react";
import PageWithLayoutType from "@/types/pageWithLayout";

import Default from "@/layouts/default";
import { Box, CircularProgress, Flex, Text } from "@chakra-ui/react";
import { GetStaticPaths, GetStaticProps } from "next";
import { supabase } from "utils/initSupabase";
import { useRouter } from "next/router";
import { UrlObject } from "url";
import { useNavigationStore } from "providers/RootStoreProvider";
import dynamic from "next/dynamic";

const LordIcon = dynamic(() => import("@/components/LordIcon"), {
  ssr: false,
});

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

const Lobby: React.FC<ILobbyProps> = (props) => {
  const { paths } = props;

  const router = useRouter();
  const navigationStore = useNavigationStore();
  const isDevelopment = process.env.NEXT_PUBLIC_ENVIRONMENT === "development";

  // const [{ isEligible, redirectPath }, setState] = useState<LobbyState>({
  //   isEligible: false,
  //   redirectPath: "/verification",
  // });

  const [redirectPath, setRedirectPath] = useState<string | UrlObject>({
    pathname: "/[package]/[section]",
    query: {
      package: paths.package.id,
      section: paths.id,
    },
  });

  const [progress, setProgress] = useState(10);
  const [status, setStatus] = useState("Mencoba koneksi...");
  const [icon, setIcon] = useState("/icons/globe.json");

  useEffect(() => {
    if (isDevelopment && paths) {
      let intervalTimer = setInterval(() => {
        setProgress(progress + 1);
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
          // console.log("redirectPath:", redirectPath);
          router.push(redirectPath);
      }

      if (progress === 100) {
        clearInterval(intervalTimer);
      }

      return () => {
        clearInterval(intervalTimer);
      };
    }
  }, [redirectPath, progress]);

  return (
    <>
      <Flex
        direction="column"
        maxW="100%"
        minH="90vh"
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
        m="10"
        p="10"
      >
        <Flex justifyContent="center" color="red.500">
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
            Harap tunggu
          </Text>
          <Text
            color="blueGray.600"
            fontSize="2xl"
            lineHeight="10"
            className="pulse"
          >
            {status}
          </Text>
          <Box bgColor="red.50" p="4" mt="6" rounded="xl">
            <Text maxW="lg" color="red.500">
              <Text as="span" color="red.600" fontWeight="bold">
                PERHATIAN:
              </Text>{" "}
              Halaman ini akan beralih dengan sendirinya. Saat layar berubah ke
              mode fullscreen, mengganti tab atau window dapat menyebabkan
              diskualifikasi
            </Text>
          </Box>
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
