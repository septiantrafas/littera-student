import React, { useEffect, useState } from "react";

import PageWithLayoutType from "@/types/pageWithLayout";
import QuestionNavigator from "@/components/QuestionNavigator";
import Exam from "@/layouts/exam";

import {
  Box,
  Radio,
  RadioGroup,
  useColorModeValue as mode,
  Stack,
  Text,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { observer } from "mobx-react";
import { supabase } from "utils/initSupabase";
import { GetServerSideProps } from "next";
import { useNavigationStore, useTimeStore } from "providers/RootStoreProvider";
import { useRouter } from "next/router";

type IQuestionsPath = {
  id: string;
  number: number;
  section_id: string;
  sections: {
    id: string;
    start_time: string;
    end_time: string;
    packages: { id: number };
  };
};

type IQuestionsResponse = {
  id: string;
  section_id: string;
  number: number;
  question: string;
  options: string[];
  created_at: string;
  updated_at: string;
};

type IQuestionsUrl = {
  question: string;
};

type IQuestionProps = {
  id: string;
  section_id: string;
  number: number;
  question: string;
  options: string[];
};

const ExamQuestionPage = (props: IQuestionProps) => {
  const store = useNavigationStore();
  const time = useTimeStore();
  const router = useRouter();

  useEffect(() => {
    if (!time.END_TIME) {
      router.push({
        pathname: "/[package]/[section]",
        query: {
          package: router.query.package,
          section: router.query.section,
        },
      });
    }
  }, [time.END_TIME]);

  useEffect(() => {
    const position = store.paths.findIndex(
      (arr) => arr.params.question.id === props.id
    );
    const id = store.paths[position].params.question.id;
    store.addToVisitedIndex(id);
  }, [store.paths, props.id]);

  return (
    <Flex height="95vh" justifyContent="center">
      <Box
        position="relative"
        w="100%"
        px="10"
        py="12"
        overflow="scroll"
        bg={mode("white", "trueGray.800")}
      >
        <Box maxW={{ xl: "2xl", "2xl": "3xl" }} mx="auto">
          <Text fontSize="xl" fontWeight="semibold">
            {props.number}. {props.question}
          </Text>
          <RadioGroup
            onChange={(value: number) =>
              store.setAnsweredIndex({
                question_id: props.id,
                option_id: value,
              })
            }
            value={store.getSelectedOption(props.id)}
            mt="10"
          >
            <Stack direction="column" spacing="5">
              {props.options.map((item, index) => {
                const number = index + 1;
                const isItemSelected =
                  store.getSelectedOption(props.id) === number;
                return (
                  <Box
                    px="6"
                    key={number}
                    d="flex"
                    cursor="pointer"
                    borderWidth="1px"
                    borderRadius="xl"
                    bg={
                      isItemSelected
                        ? mode("blue.50", "gray.800")
                        : mode("white", "gray.800")
                    }
                    color={
                      isItemSelected
                        ? mode("blue.800", "gray.200")
                        : mode("gray.800", "gray.200")
                    }
                    fontWeight={isItemSelected ? "medium" : "base"}
                    boxShadow={isItemSelected ? "outline" : "sm"}
                    _hover={{
                      boxShadow: isItemSelected ? "outline" : "base",
                      transform: "translateY(-2px)",
                    }}
                    borderColor={
                      isItemSelected ? "blue.600" : mode("gray.200", "gray.700")
                    }
                    onClick={() =>
                      store.setAnsweredIndex({
                        question_id: props.id,
                        option_id: number,
                      })
                    }
                    style={{
                      WebkitTransition: "box-shadow 250ms, transform 200ms",
                      transition: "box-shadow 250ms, transform 200ms",
                    }}
                  >
                    <Text
                      fontSize="5xl"
                      fontWeight="bold"
                      textColor={
                        isItemSelected
                          ? mode("blue.100", "blue.400")
                          : mode("gray.100", "gray.400")
                      }
                      my="auto"
                      mr="6"
                      textTransform="uppercase"
                    >
                      {String.fromCharCode("a".charCodeAt(0) + index)}
                    </Text>
                    <Radio
                      my="10"
                      value={number}
                      cursor="pointer"
                      onClick={() =>
                        store.setAnsweredIndex({
                          question_id: props.id,
                          option_id: number,
                        })
                      }
                      hidden
                    >
                      {item}
                    </Radio>
                  </Box>
                );
              })}
            </Stack>
          </RadioGroup>
        </Box>
      </Box>
      <Divider orientation="vertical" />
      <Box
        w={{ xl: "30%", "2xl": "25%" }}
        bg={mode("gray.50", "trueGray.900")}
        justifyContent="space-between"
      >
        <QuestionNavigator id={props.id} />
      </Box>
    </Flex>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = `
  id,
  number,
  section_id, 
    sections:section_id (
        id,
        start_time,
        end_time,
        packages:package_id ( id ) 
    )
  `;

  const path_res = await supabase
    .from<IQuestionsPath>("questions")
    .select(query)
    .match({ section_id: context.params.section.toString() })
    .order("number", { ascending: true });

  const paths = path_res.data.map((question) => ({
    params: {
      package: question.sections.packages.id.toString(),
      section: question.sections.id.toString(),
      question: {
        id: question.id.toString(),
        number: question.number,
      },
    },
  }));

  const position = paths.findIndex(
    (arr) => arr.params.question.id === context.params.question.toString()
  );

  const next_path = paths[position + 1] ? paths[position + 1] : null;
  const previous_path = paths[position - 1] ? paths[position - 1] : null;

  const res = await supabase
    .from<IQuestionsResponse>("questions")
    .select("*")
    .match({ id: context.params.question.toString() })
    .single();

  const data = res.data;

  const hydrationData = {
    navigationStore: {
      paths,
      next_path,
      previous_path,
    },
  };
  // Pass data to the page via props
  return {
    props: {
      hydrationData,
      id: data.id,
      section_id: data.section_id,
      number: data.number,
      question: data.question,
      options: data.options,
    },
  };
};

(ExamQuestionPage as PageWithLayoutType).layout = Exam;

export default observer(ExamQuestionPage);
