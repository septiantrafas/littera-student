import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useTimeStore } from "providers/RootStoreProvider";

import { Flex, Text, useColorModeValue as mode } from "@chakra-ui/react";
import { HiOutlineClock } from "react-icons/hi";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { clear } from "console";
import { useRouter } from "next/router";
dayjs.extend(utc);

export const TimeKeeper = observer(() => {
  const store = useTimeStore();

  useEffect(() => {
    setTimeout(() => {
      const timeLeft = store.calculateTimeLeft(store.TIME);

      if (timeLeft.unix() > 0) {
        store.updateTime(dayjs(store.TIME).add(1, "seconds").toISOString());
        document.getElementById("time").innerHTML = timeLeft.format("HH:mm:ss");
      }
      // else {
      //   router.push({
      //     pathname: "/[package]/[section]",
      //     query: store.TIMEOUT_PATH,
      //   });
      // }
    }, 1000);
    return () => {
      clearTimeout();
    };
  }, [store.TIME]);

  // render data
  return (
    <>
      <Flex
        // hidden={!store.endTime}
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
        >
          00:00:00
        </Text>
      </Flex>
    </>
  );
});
