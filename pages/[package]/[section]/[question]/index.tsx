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
import { useNavigationStore } from "providers/RootStoreProvider";

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
  const store = useNavigationStore();

  const isSelected = (item) => {
    return value === item;
  };

  useEffect(() => {
    const position = store.paths.findIndex(
      (arr) => arr.params.question.id === props.id
    );
    store.addToVisitedIndex(position);
  }, [store.paths, store.VISITED_INDEX]);

  return (
    <Flex height="95vh" justifyContent="center">
      <Box
        boxShadow="2xl"
        position="relative"
        w="100%"
        px="10"
        py="12"
        overflow="scroll"
      >
        <Box maxW={{ xl: "2xl", "2xl": "3xl" }} mx="auto">
          <Text fontSize="xl" fontWeight="semibold">
            {props.number}. {props.question}
          </Text>
          <RadioGroup
            onChange={(string) => setValue(string)}
            value={value}
            mt="10"
          >
            <Stack direction="column" spacing="5">
              {props.options.map((item, index) => (
                <Box
                  px="6"
                  key={item}
                  d="flex"
                  cursor="pointer"
                  borderWidth="1px"
                  borderRadius="xl"
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
                    fontSize="5xl"
                    fontWeight="bold"
                    textColor={
                      isSelected(item)
                        ? mode("blue.100", "blue.400")
                        : mode("gray.100", "gray.400")
                    }
                    my="auto"
                    textTransform="uppercase"
                  >
                    {String.fromCharCode("a".charCodeAt(0) + index)}
                  </Text>
                  <Divider
                    mx="4"
                    height="100%"
                    borderColor={mode("gray.200", "gray.700")}
                    orientation="vertical"
                  />
                  <Radio my="10" value={item} hidden>
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

  // Pass data to the page via props
  return {
    props: {
      hydrationData: {
        navigationStore: {
          paths,
          next_path,
          previous_path,
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
