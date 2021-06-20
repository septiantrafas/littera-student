import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Button,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { HiCheckCircle, HiIdentification, HiXCircle } from "react-icons/hi";
import isFastNet from "utils/isFastNet";
import { supabase } from "utils/initSupabase";
import { Auth } from "@supabase/ui";
import PopoverIdentityForm from "components/PopoverIdentityForm";

type IDynamicListIconProps = {
  condition: boolean;
  header: string;
  content: string;
};

export const RequirementCheck: React.FC = () => {
  const { user, session } = Auth.useUser();
  const [identity, setIdentity] = useState("");
  const [isIdentityAvailable, setIsIdentityAvailable] = useState(false);
  const [isMediaAvailable, setisMediaAvailable] = useState(false);
  const [isInternetStable, setIsInternetStable] = useState(false);
  const [isCheckingSpeed, setIsCheckingSpeed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        let { data, error } = await supabase
          .from("profiles")
          .select("identity")
          .eq("id", user.id);

        const identity = data[0].identity;
        if (identity) {
          setIdentity(identity);
          setIsIdentityAvailable(true);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [user, identity]);

  useEffect(() => {
    if (navigator.mediaDevices.getUserMedia && !isMediaAvailable) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(function (stream) {
          setisMediaAvailable(true);

          console.info("Media Permission Success!");

          stream.getTracks().forEach(function (track) {
            track.stop();
          });
        })
        .catch(function (err) {
          console.error("Media Permission Error!");
        });
    }
  }, [isMediaAvailable]);

  const handleIdentityChange = (value) => {
    setIdentity(value);
  };

  return (
    <Box>
      <Heading size="lg" mb="4">
        Persyaratan
      </Heading>
      <List spacing={2}>
        <Card>
          <DynamicListIcon
            header="Pengisian Identitas"
            content="Untuk memastikan partisipan yang mengikuti asesmen benar terdaftar"
            condition={isIdentityAvailable}
          />
          {!isIdentityAvailable ? (
            <PopoverIdentityForm onChange={handleIdentityChange} />
          ) : (
            <Flex color="gray.400" alignItems="center">
              <HiIdentification />
              <Text ml="2">{identity}</Text>
            </Flex>
          )}
        </Card>
        <Card>
          <DynamicListIcon
            header="Akses Kamera dan Mikrofon"
            content="Kami memantau anda dibelakang layar untuk menjaga tes tetap adil"
            condition={isMediaAvailable}
          />

          <Button
            variant="ghost"
            colorScheme="blue"
            size="sm"
            disabled={isMediaAvailable}
          >
            Berikan izin
          </Button>
        </Card>
        <Card>
          <DynamicListIcon
            header="Kestabilan Internet"
            content="Pastikan internet anda stabil agar tes dapat berjalan dengan lancar"
            condition={isInternetStable}
          />
          <Button
            variant="ghost"
            colorScheme="blue"
            size="sm"
            isLoading={isCheckingSpeed}
            onClick={() => {
              setIsCheckingSpeed(true);
              isFastNet((value) => {
                setIsInternetStable(value);
                console.log("is connection fast?: " + isInternetStable);
                setIsCheckingSpeed(false);
              });
            }}
          >
            Cek ulang
          </Button>
        </Card>
      </List>
    </Box>
  );
};

const DynamicListIcon: React.FC<IDynamicListIconProps> = (props) => {
  return (
    <Flex alignItems="center">
      <ListIcon
        fontSize="3xl"
        as={props.condition ? HiCheckCircle : HiXCircle}
        color={props.condition ? "emerald.500" : "red.500"}
      />
      <Box ml="2" w="60%">
        <Text
          fontSize="lg"
          fontWeight="medium"
          color={props.condition ? "emerald.900" : "red.900"}
        >
          {/* Verifikasi Identitas */}
          {props.header}
        </Text>
        <Text fontSize="sm" color="gray.600">
          {props.content}
        </Text>
      </Box>
    </Flex>
  );
};

const Card: React.FC = ({ children }) => {
  return (
    <ListItem
      p="6"
      my="2"
      display="flex"
      border="1px"
      borderRadius="lg"
      borderColor="gray.200"
      alignItems="center"
      justifyContent="space-between"
    >
      {children}
    </ListItem>
  );
};
