import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import PageWithLayoutType from "@/types/pageWithLayout";
import { QuestionNavigator } from "@/components/QuestionNavigator";
import Exam from "@/layouts/exam";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  useColorModeValue as mode,
  Stack,
  Text,
  Flex,
} from "@chakra-ui/react";
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTimeStore } from "providers/RootStoreProvider";
import { reaction } from "mobx";

type IQuestionProps = {
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
  const store = useTimeStore();
  const router = useRouter();
  const [value, setValue] = useState<string | number>("1");

  const instruction_time = dayjs(props.instruction_time);
  useEffect(() => {
    if (dayjs().isBefore(instruction_time)) {
      store.updateEndTime(props.instruction_time);
    } else {
      console.log(dayjs().isBefore(instruction_time));
      store.updateEndTime(props.end_time);
    }
  }, []);

  useEffect(() => {
    if (dayjs().isAfter(instruction_time)) {
      router.push(`/exam/${props.category_id}/${props.id}/1`);
      store.updateEndTime(props.end_time);
    }
  }, [store.END_TIME]);

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
    <Flex mx="auto" maxW="6xl" mt="8">
      <Box
        w="70%"
        px="10"
        py="6"
        mr="10"
        bg={mode("white", "gray.700")}
        borderWidth="1px"
        borderRadius="md"
        shadow={mode("md", "lg")}
      >
        <Text fontSize="lg" fontWeight="semibold">
          {props.id}. {props.question}
        </Text>
        <RadioGroup
          onChange={(string) => setValue(string)}
          value={value}
          mt="6"
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
      </Box>
      <Box w="30%" px="8" justifyContent="space-between">
        <QuestionNavigator
          category_id={props.category_id}
          question_id={props.id}
          total_question={props.total_question}
        />
        <Flex
          w="full"
          justifyContent="flex-end"
          hidden={props.subquestion_route}
        >
          <Button
            colorScheme="blue"
            onClick={() => router.push(getNextRoute())}
          >
            Next
          </Button>
        </Flex>
      </Box>
    </Flex>
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

export default observer(ExamQuestionPage);
