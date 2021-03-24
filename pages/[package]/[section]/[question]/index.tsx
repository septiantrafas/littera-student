import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import PageWithLayoutType from "@/types/pageWithLayout";
import QuestionNavigator from "@/components/QuestionNavigator";
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
  Divider,
} from "@chakra-ui/react";
import { observer } from "mobx-react";
import { supabase } from "utils/initSupabase";
import { GetServerSideProps, GetStaticPaths, GetStaticPropsResult } from "next";
import { useNavigationStore, useRootStore } from "providers/RootStoreProvider";

type IQuestionsPath = {
  id: number;
  number: number;
  section_id: string;
  sections: { id: number; packages: { id: number } };
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
  const [value, setValue] = useState<string | number>("1");
  const isSelected = (item) => {
    return value === item;
  };

  return (
    <Flex height="95vh" justifyContent="center">
      <Box
        boxShadow="lg"
        position="relative"
        w="100%"
        px="10"
        py="12"
        overflow="scroll"
      >
        <Box maxW={{ xl: "2xl", "2xl": "3xl" }} mx="auto">
          <Text fontSize="lg" fontWeight="semibold">
            {props.number}. {props.question}
          </Text>
          <RadioGroup
            onChange={(string) => setValue(string)}
            value={value}
            mt="10"
          >
            <Stack direction="column" spacing="4">
              {props.options.map((item, index) => (
                <Box
                  px="6"
                  key={item}
                  d="flex"
                  minH="100px"
                  cursor="pointer"
                  borderWidth="1px"
                  borderRadius="lg"
                  bg={
                    isSelected(item)
                      ? mode("blue.50", "gray.800")
                      : mode("white", "gray.800")
                  }
                  color={
                    isSelected(item)
                      ? mode("blue.800", "gray.200")
                      : mode("gray.800", "gray.200")
                  }
                  fontWeight={isSelected(item) ? "medium" : "base"}
                  boxShadow={isSelected(item) ? "outline" : "sm"}
                  _hover={{
                    boxShadow: isSelected(item) ? "outline" : "md",
                    transform: "translateY(-2px)",
                  }}
                  borderColor={
                    isSelected(item) ? "blue.600" : mode("gray.200", "gray.700")
                  }
                  onClick={() => setValue(item)}
                  style={{
                    WebkitTransition: "box-shadow 250ms, transform 200ms",
                    transition: "box-shadow 250ms, transform 200ms",
                  }}
                >
                  <Text
                    fontSize="2xl"
                    fontWeight="semibold"
                    textColor={
                      isSelected(item)
                        ? mode("blue.600", "blue.400")
                        : "GrayText"
                    }
                    my="auto"
                    mx="2"
                    textTransform="uppercase"
                  >
                    {String.fromCharCode("a".charCodeAt(0) + index)}
                  </Text>
                  <Divider
                    mx="3"
                    borderColor={mode("gray.200", "gray.700")}
                    orientation="vertical"
                  />
                  <Radio value={item} hidden>
                    {item}
                  </Radio>
                </Box>
              ))}
            </Stack>
          </RadioGroup>
        </Box>
      </Box>
      <Divider orientation="vertical" />
      <Box
        w={{ xl: "40%", "2xl": "30%" }}
        bg={mode("gray.50", "trueGray.900")}
        px="10"
        py="10"
        justifyContent="space-between"
      >
        <QuestionNavigator />
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

  const res = await supabase
    .from<IQuestionsResponse>("questions")
    .select("*")
    .match({ id: context.params.question.toString() })
    .single();

  const data = res.data;

  // Pass data to the page via props
  return {
    props: {
      hydrationData: {
        navigationStore: {
          paths: paths,
        },
      },
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
