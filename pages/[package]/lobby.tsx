import React, { useCallback, useEffect, useState } from "react";
import PageWithLayoutType from "@/types/pageWithLayout";

import Default from "@/layouts/default";
import { Box, Button, Flex, Text, useToast } from "@chakra-ui/react";
import { supabase } from "utils/initSupabase";
import { useRouter } from "next/router";
import { UrlObject } from "url";
import { useNavigationStore } from "providers/RootStoreProvider";
import dynamic from "next/dynamic";
import screenfull from "screenfull";
import { HiOutlineRefresh } from "react-icons/hi";
import { Auth } from "@supabase/ui";
import { definitions } from "@/types/supabase";

const LordIcon = dynamic(() => import("@/components/LordIcon"), {
  ssr: false,
});

type IPaths = {
  id: string;
  package: { id: string };
};

interface ISectionUrl {
  pathname: string;
  query?: {
    package: string;
    section: string;
  };
}

const Lobby: React.FC = () => {
  const toast = useToast();
  const router = useRouter();
  const { user, session } = Auth.useUser();
  const navigation = useNavigationStore();
  const isDevelopment = process.env.NEXT_PUBLIC_ENVIRONMENT === "development";

  const [isEligible, setEligible] = useState(false);
  const [paths, setPaths] = useState<IPaths>();
  const [redirectPath, setRedirectPath] = useState<ISectionUrl>();

  const [progress, setProgress] = useState(10);
  const [status, setStatus] = useState("Menunggu akses diberikan...");
  const [icon, setIcon] = useState("/icons/error.json");
  const [isFullScreen, setFullScreen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [participantStatus, setParticipantStatus] = useState("");

  const fetchNextPath = useCallback(async () => {
    const query = `
      id,
      package:package_id (id)
    `;

    if (router.query.package) {
      try {
        // TODO: Somehow at prerendering the router.query return an empty object 🤷‍♂️
        console.log(router.query.package);
        const res = await supabase
          .from<any>("sections")
          .select(query)
          .match({ package_id: router.query.package })
          .order("number", { ascending: true })
          .limit(1)
          .single();

        setPaths(res.data);
        setRedirectPath({
          pathname: "/[package]/[section]",
          query: {
            package: res.data.package.id,
            section: res.data.id,
          },
        });
      } catch (error) {
        console.error("response error:", error);
        return { notFound: true };
      }
    }
  }, [router.query.package]);

  useEffect(() => {
    fetchNextPath();
  }, [fetchNextPath]);

  useEffect(() => {
    if (isEligible === false && user) {
      (async () => {
        const { data, error } = await supabase
          .from("participants")
          .select(`id, profile_id, status`)
          .match({ profile_id: user.id })
          .single();

        if (data) {
          setEligible(true)
          setParticipantStatus(data.status)
        };

        if (error) {
          console.log(error)
        }
        console.log("Profile Status:", data.status)
      })();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const userListener = supabase
        .from(`participants:profile_id=eq.${user.id}`)
        .on("UPDATE", (payload) => setParticipantStatus(payload.new.status))
        .subscribe();

      return () => {
        userListener.unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    if (isDevelopment && paths && isFullScreen && user) {
      let timer = setInterval(() => {
        if (!paused) {
          setProgress(progress + 5);
          console.log(progress);
        }
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
          setIcon("/icons/fingerprints.json");
          setStatus("memverifikasi identitas...");
          break;
        case 35:
          if (participantStatus !== "online") {
            setPaused(true)
            setStatus("Menunggu verifikasi pengawas")
          } else {
            setPaused(false)
            setProgress(40) //Jump to case 40 (Preparing test environment)
          }

          if (isEligible === false) {
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

          // Populate ANSWERED_INDEX
          (async () => {
            const res = await supabase
              .from<definitions["answers"]>("answers")
              .select("id, question_id")
              .eq("participant_id", navigation.participant);

            res.data.map((answer) => {
              navigation.answer_map[answer.question_id] = answer.id;
            });
          })();

          break;
        case 50:
          setIcon("/icons/conference.json");
          setStatus("mengakses ruangan tes...");
          break;
        case 100:
          setIcon("/icons/clock.json");
          setStatus("menunggu jadwal tes dimulai...");

          console.log("redirectPath:", JSON.stringify(redirectPath));

          if (navigation.CURRENT_PATH) {
            const params = navigation.CURRENT_PATH.params;
            router.push({
              pathname: "/[package]/[section]",
              query: {
                package: params.package,
                section: params.section,
              },
            });
          } else {
            router.push(redirectPath);
          }
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
    participantStatus,
    paused,
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
  }, []);

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

(Lobby as PageWithLayoutType).layout = Default;

export default Lobby;
