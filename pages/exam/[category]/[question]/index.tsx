import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import PageWithLayoutType from "@/types/pageWithLayout";

import Exam from "@/layouts/exam";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Flex,
} from "@chakra-ui/react";
import { inject, observer } from "mobx-react";
import { DataStore } from "@/stores/DataStore";
import dayjs from "dayjs";

type IQuestionUrl = {
  question: string;
};

type IQuestionProps = {
  dataStore?: DataStore;
  id: number;
  category_id: number;
  instruction_time: string;
  start_time: string;
  end_time: string;
  answer: string[];
  subquestion_route: any;
  question: string;
  total_question: number;
};

const ExamQuestionPage = (props: IQuestionProps) => {
  const dataStore = props.dataStore;
  const router = useRouter();
  const [value, setValue] = useState<string | number>("1");

  const instruction_time = dayjs(props.instruction_time);
  if (dayjs().isBefore(instruction_time)) {
    dataStore.changeEndTime(props.instruction_time);
  } else {
    dataStore.changeEndTime(props.end_time);
  }

  useEffect(() => {
    return () => {
      dataStore.changeEndTime(props.end_time);
      router.push(`/exam/${props.category_id}/${props.id}/1`);
    };
  }, [dataStore.endTime]);

  function getNextRoute() {
    const next_question = props.id + 1;
    const next_category = props.category_id + 1;

    if (props.id !== props.total_question) {
      return `/exam/${props.category_id}/${next_question}`;
    } else {
      if (props.category_id !== 7) {
        return `/exam/${next_category}`;
      } else {
        return `/exam/lobby`;
      }
    }
  }

  return (
    <>
      <Box w="50%" mx="20" my="10">
        <Text fontSize="lg" fontWeight="semibold">
          {props.id}. {props.question}
        </Text>
        <RadioGroup
          onChange={(string) => setValue(string)}
          value={value}
          my="6"
        >
          <Stack direction="column" spacing="4">
            {props.answer.map((item) => (
              <Box
                p="6"
                key={item}
                cursor="pointer"
                borderWidth="1px"
                borderRadius="md"
                color={
                  value !== "1"
                    ? value === item
                      ? "gray.800"
                      : "gray.400"
                    : "gray.800"
                }
                fontWeight={value === item ? "medium" : "base"}
                boxShadow={value === item ? "outline" : ""}
                borderColor={value === item ? "blue.600" : "gray.200"}
                onClick={() => setValue(item)}
                style={{
                  WebkitTransition: "box-shadow 250ms",
                  transition: "box-shadow 250ms",
                }}
              >
                <Radio value={item} hidden>
                  {item}
                </Radio>
              </Box>
            ))}
          </Stack>
        </RadioGroup>
        <Flex alignItems="end" hidden={props.subquestion_route}>
          <Button onClick={() => router.push(getNextRoute())}>Next</Button>
        </Flex>
      </Box>
    </>
  );
};

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = context.params;
  // Fetch data from external API
  const res = await fetch(
    `http://localhost:3001/categories/${context.params.category}?_embed=questions`
  );
  const data = await res.json();
  const results = data.questions[Number(params.question) - 1];

  if (!results) {
    return {
      notFound: true,
    };
  }

  let subquestion_route = null;
  if (results.answer.length === 0) {
    subquestion_route = `/exam/${params.category}/${params.question}/1`;
  }

  // Pass data to the page via props
  return {
    props: {
      id: Number(params.question),
      category_id: Number(params.category),
      instruction_time: results.instruction_time,
      start_time: results.start_time,
      end_time: results.end_time,
      answer: results.answer,
      subquestion_route: subquestion_route,
      question: results.question,
      total_question: Object.keys(data.questions).length,
    },
  };
};

(ExamQuestionPage as PageWithLayoutType).layout = Exam;

export default inject("dataStore")(observer(ExamQuestionPage));
