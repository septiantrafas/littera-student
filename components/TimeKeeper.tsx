import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useTimeStore } from "providers/RootStoreProvider";

import { Flex, Text, useColorModeValue as mode } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { HiOutlineClock } from "react-icons/hi";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/router";

dayjs.extend(utc);

export const TimeKeeper = observer(() => {
  const [isReminded, setIsReminded] = useState(false);
  const store = useTimeStore();
  const router = useRouter();
  const toast = useToast();
  const toast_id = "time-reminder";

  useEffect(() => {
    setTimeout(() => {
      const timeLeft = store.calculateTimeLeft(store.TIME);

      console.log("timeleft: ", timeLeft.unix());
      if (timeLeft.unix() > 0) {
        store.updateTime(dayjs(store.TIME).add(1, "seconds").toISOString());
        document.getElementById("time").innerHTML = timeLeft.format("HH:mm:ss");

        if (timeLeft.unix() < 60 && !isReminded && !toast.isActive(toast_id)) {
          setIsReminded(true);

          toast({
            id: toast_id,
            title: "Peringatan",
            description: "Waktu tersisa satu menit lagi",
            status: "info",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
        }
      } else {
        document.getElementById("time").innerHTML = "00:00:00";
        setIsReminded(false);
        router.push({
          pathname: "/[package]/[section]",
          query: {
            package: store.TIMEOUT_PATH.package,
            section: store.TIMEOUT_PATH.section,
          },
        });
      }
    }, 1000);
    return () => {
      clearTimeout();
    };
  }, [store.TIME]);

  // push to lobby if exam is not started
  useEffect(() => {
    const now = dayjs(store.TIME);
    const start_time = dayjs(store.START_TIME);

    if (now.isBefore(start_time)) {
      console.log("This section is not started yet");
      router.push({
        pathname: "/[package]/[section]",
        query: {
          package: router.query.package,
          section: "lobby",
        },
      });
    }
  }, []);

  return (
    <>
      <Flex
        borderRightRadius="full"
        borderLeftRadius="full"
        borderWidth="1px"
        alignItems="center"
        borderColor={mode("gray.200", "gray.600")}
        color="gray.400"
        px="4"
        py="2"
      >
        <HiOutlineClock size="1.25em" />
        <Text
          id="time"
          fontSize="sm"
          ml="2"
          color={mode("gray.400", "gray.400")}
          data-cy="timer-text"
        >
          00:00:00
        </Text>
      </Flex>
    </>
  );
});
