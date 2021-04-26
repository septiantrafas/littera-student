import React, { useEffect, useState } from "react";
import PageWithLayoutType from "@/types/pageWithLayout";
import { useRouter } from "next/router";

import Default from "@/layouts/default";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  chakra,
  Flex,
  Link,
  Stack,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import {
  HiOutlineVideoCamera,
  HiOutlineMicrophone,
  HiArrowRight,
} from "react-icons/hi";

const Permission: React.FC = () => {
  const router = useRouter();

  const [isMediaPermissionGranted, setMediaPermission] = useState(false);

  useEffect(() => {
    if (navigator.mediaDevices.getUserMedia && !isMediaPermissionGranted) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(function (stream) {
          setMediaPermission(true);

          console.info("Media Permission Success!");

          stream.getTracks().forEach(function (track) {
            track.stop();
          });
        })
        .catch(function (err) {
          console.error("Media Permission Error!");
        });
    }
  }, [isMediaPermissionGranted]);

  return (
    <>
      <Box maxW="100%" textAlign="center" overflow="hidden" p="5">
        <Box mx="auto" maxW="xl" mt="6">
          <Text
            color={mode("blueGray.700", "gray.100")}
            letterSpacing="-0.025em"
            fontSize="5xl"
            fontWeight="extrabold"
            lineHeight="0.9"
          >
            Berikan akses untuk mikrofon dan kamera
          </Text>
          <Flex justifyContent="center" my="16">
            <Stack direction="row" spacing={20}>
              <Avatar
                w="2.5em"
                h="2.5em"
                bg={mode("gray.100", "gray.700")}
                color={mode("gray.700", "gray.200")}
                size="2xl"
                icon={<HiOutlineVideoCamera fontSize="1.25em" />}
              >
                <AvatarBadge boxSize="0.9em">
                  <chakra.span
                    h="full"
                    w="full"
                    opacity="75"
                    rounded="full"
                    position="absolute"
                    display="inline-flex"
                    bg={isMediaPermissionGranted ? "green.400" : "orange.400"}
                    style={{
                      animation:
                        "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
                    }}
                  />
                  <chakra.span
                    data-cy="camera-status"
                    position="relative"
                    display="inline-flex"
                    h="full"
                    w="full"
                    rounded="full"
                    bg={isMediaPermissionGranted ? "green.500" : "tomato"}
                  />
                </AvatarBadge>
              </Avatar>

              <Avatar
                w="2.5em"
                h="2.5em"
                bg={mode("gray.100", "gray.700")}
                color={mode("gray.700", "gray.200")}
                size="2xl"
                icon={<HiOutlineMicrophone fontSize="1.25em" />}
              >
                <AvatarBadge boxSize="0.9em">
                  <chakra.span
                    h="full"
                    w="full"
                    opacity="75"
                    rounded="full"
                    position="absolute"
                    display="inline-flex"
                    bg={isMediaPermissionGranted ? "green.400" : "orange.400"}
                    style={{
                      animation:
                        "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
                    }}
                  />
                  <chakra.span
                    data-cy="microphone-status"
                    position="relative"
                    display="inline-flex"
                    h="full"
                    w="full"
                    rounded="full"
                    bg={isMediaPermissionGranted ? "green.500" : "tomato"}
                  />
                </AvatarBadge>
              </Avatar>
            </Stack>
          </Flex>
          <Text
            color={mode("gray.500", "gray.400")}
            fontSize="lg"
            lineHeight="6"
          >
            LITTERA membutuhkan akses mikrofon dan kamera anda. Dengan akses ini
            sistem kami dapat mendeteksi tindakan-tindakan yang melanggar hukum.
            Pertimbangan mengenai hak dan privasi pengguna dapat anda lihat
            kembali <Link fontWeight="semibold">disini</Link>
          </Text>
          <Button
            mt="8"
            colorScheme="blue"
            rightIcon={<HiArrowRight />}
            isDisabled={!isMediaPermissionGranted}
            onClick={() => {
              router.push("/");
            }}
          >
            Lanjut
          </Button>
        </Box>
      </Box>
    </>
  );
};

(Permission as PageWithLayoutType).layout = Default;

export default Permission;
