import React, { useEffect, useState } from "react";
import { inject } from "mobx-react";
import { observer } from "mobx-react-lite";
import { DataStore } from "../stores/DataStore";

import { io } from "socket.io-client";
import { Flex, Text, useColorModeValue as mode } from "@chakra-ui/react";
import { HiOutlineClock } from "react-icons/hi";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

type Props = {
  dataStore?: DataStore;
};

export const TimeKeeper = inject("dataStore")(
  observer((props: Props) => {
    const [countdown, setCountdown] = useState<string>("");

    const dataStore = props.dataStore!;
    // const end_time = dayjs(dataStore.endTime).toDate().getTime();
    let end_time: number = dayjs().add(1, "minutes").toDate().getTime();

    useEffect(() => {
      fetch("/api/hello").finally(() => {
        const socket = io();

        socket.on("counter", function (time: string) {
          dataStore.changeTime(time);
          manipulate_countdown(time);
        });

        return () => socket.disconnect();
      });
    }, []);

    const manipulate_countdown = (time: string) => {
      const now = dayjs(time).toDate().getTime();
      const time_difference = dayjs(end_time - now).utcOffset(0);

      setCountdown(time_difference.format("HH:mm:ss"));

      if (time_difference.unix() < 0) {
        dataStore.changeEndTime("");
        setCountdown("DONE");
      }
    };

    // render data
    return (
      <Flex
        borderWidth="1px"
        borderRightRadius="full"
        borderLeftRadius="full"
        alignItems="center"
        color="gray.400"
        px="4"
        py="2"
        hidden={!dataStore.endTime}
      >
        <HiOutlineClock size="1.5em" />
        <Text id="time" ml="2" color={mode("gray.600", "gray.400")}>
          {countdown}
        </Text>
      </Flex>
    );
  })
);
