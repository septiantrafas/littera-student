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
  Button,
  Spinner,
} from "@chakra-ui/react";
import { observer } from "mobx-react";
import { supabase } from "utils/initSupabase";
import { GetStaticPaths, GetStaticProps } from "next";
import { useNavigationStore, useTimeStore } from "providers/RootStoreProvider";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import ReactHtmlParser from "react-html-parser";

type IQuestionsPath = {
  id: string;
  number: number;
  section_id: string;
  sections: {
    id: string;
    start_time: string;
    end_time: string;
    context: string;
    packages: { id: number };
  };
};

type IQuestionsResponse = {
  id: string;
  section_id: string;
  number: number;
  text?: string;
  question: string;
  options: any;
  created_at: string;
  updated_at: string;
};

type IQuestionProps = {
  id: string;
  section_id: string;
  number: number;
  text?: string;
  question: string;
  options: any;
};

const ExamQuestionPage = (props: IQuestionProps) => {
  const store = useNavigationStore();
  const time = useTimeStore();
  const router = useRouter();
  const { isFallback } = useRouter();

  const [isOptionsUseImage, setOptionsUseImage] = useState(false);

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
  }, [time.END_TIME, router]);

  useEffect(() => {
    const imageNodeName =
      document.getElementById("htmlRenderer").childNodes[0].childNodes[0]
        .nodeName;
    const isImageExist = imageNodeName.toLowerCase() === "img";

    setOptionsUseImage(isImageExist);
    console.log(imageNodeName);
    console.log(isImageExist);
  }, [isFallback]);

  useEffect(() => {
    const position = store.paths.findIndex(
      (arr) => arr.params.question.id === props.id
    );

    const id = store.paths[position].params.question.id;
    store.addToVisitedIndex(id);
  }, [props.id, store]);

  if (isFallback) {
    return (
      <>
        <Spinner size="lg" />
      </>
    );
  }

  // TODO: REFACTOR THIS TO COMPONENT BASED
  return (
    <Flex height="95vh" bg={mode("white", "gray.800")}>
      <QuestionNavigator id={props.id} />
      {!isOptionsUseImage && <Box
        w="50%"
        px="10"
        py="12"
        overflow="scroll"
      >
        <Text className="options-with-image">
          {!props.text && ReactHtmlParser(props.question)}
          {ReactHtmlParser(props.text)}
        </Text>
      </Box>}
      <Box
        w={isOptionsUseImage ? "100%" : "50%"}
        px="10"
        py="12"
        justifyContent="space-between"
        overflowY="scroll"
      >
        <Box
          maxW={isOptionsUseImage ? "full" : { xl: "2xl", "2xl": "3xl" }}
          mx="auto"
        >
          <Text
            display="flex"
            justifyContent="center"
            alignItems="center"
            fontWeight="semibold"
            className="options-with-image"
          >
            {props.text && ReactHtmlParser(props.question)}
            {isOptionsUseImage && ReactHtmlParser(props.question)}
            {!props.text && null}
          </Text>
          <RadioGroup
            onChange={(nextValue) =>
              store.setAnsweredIndex({
                question_id: props.id,
                option_id: parseFloat(nextValue),
              })
            }
            value={store.getSelectedOption(props.id)}
            mt="6"
          >
            <Flex w="full" direction={isOptionsUseImage ? "row" : "column"}>
              {props.options?.map((item, index) => {
                const number = index + 1;
                const isItemSelected =
                  store.getSelectedOption(props.id) === number;

                return (
                  <Box
                    px="6"
                    mx={isOptionsUseImage ? "4" : "0"}
                    my={isOptionsUseImage ? "0" : "2"}
                    key={number}
                    d={isOptionsUseImage ? "block" : "flex"}
                    cursor="pointer"
                    borderWidth="1px"
                    borderRadius="lg"
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
                      fontSize="3xl"
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
                      my="4"
                      value={number}
                      cursor="pointer"
                      size="md"
                      onClick={() =>
                        store.setAnsweredIndex({
                          question_id: props.id,
                          option_id: number,
                        })
                      }
                      hidden
                    >
                      <div id="htmlRenderer" className="options-with-image">
                        {ReactHtmlParser(item.value)}
                      </div>
                    </Radio>
                  </Box>
                );
              })}
            </Flex>
          </RadioGroup>
        </Box>
        <Flex mt="4" w="full" alignItems="flex-end">
          <Flex w="full" alignItems="center" justifyContent="space-between">
            <NextLink
              href={
                store.previous_path
                  ? {
                      pathname: "/[package]/[section]/[question]",
                      query: {
                        package: store.previous_path.params.package,
                        section: store.previous_path.params.section,
                        question: store.previous_path.params.question.id,
                      },
                    }
                  : ""
              }
            >
              <Button
                variant="ghost"
                textColor="gray.600"
                leftIcon={<HiChevronLeft />}
                isDisabled={!store.previous_path}
              >
                Back
              </Button>
            </NextLink>

            <NextLink
              href={
                store.next_path
                  ? {
                      pathname: "/[package]/[section]/[question]",
                      query: {
                        package: store.next_path.params.package,
                        section: store.next_path.params.section,
                        question: store.next_path.params.question.id,
                      },
                    }
                  : ""
              }
            >
              <Button
                variant="ghost"
                textColor="gray.600"
                rightIcon={<HiChevronRight />}
                isDisabled={!store.next_path}
              >
                Next
              </Button>
            </NextLink>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  let data = null;

  const query = `
  id,
  number,
  section_id, 
    sections:section_id (
        id,
        start_time,
        end_time,
        context,
        packages:package_id ( id ) 
    )
  `;

  const path_res = await supabase
    .from<IQuestionsPath>("questions")
    .select(query)
    .match({ section_id: context.params.section.toString() })
    .order("number", { ascending: true });

  let instruction = "";
  const paths = path_res.data.map((question) => {
    instruction = question.sections.context;

    return {
      params: {
        package: question.sections.packages.id.toString(),
        section: question.sections.id.toString(),
        question: {
          id: question.id.toString(),
          number: question.number,
        },
      },
    };
  });

  const position = paths.findIndex(
    (arr) => arr.params.question.id === context.params.question.toString()
  );

  const previous_path = paths[position - 1] ? paths[position - 1] : null;
  const current_path = paths[position];
  const next_path = paths[position + 1] ? paths[position + 1] : null;

  try {
    const res = await supabase
      .from<IQuestionsResponse>("questions")
      .select("*")
      .match({ id: context.params.question.toString() })
      .single();

    data = res.data;
  } catch (error) {
    console.error("response error:", error);
    return { notFound: true };
  }
  const options = JSON.parse(data.options);

  // console.log(options[0].value);

  const hydrationData = {
    navigationStore: {
      paths,
      previous_path,
      current_path,
      next_path,
      current_instruction: instruction,
    },
  };

  // Pass data to the page via props
  try {
    return {
      props: {
        hydrationData,
        id: data.id,
        section_id: data.section_id,
        number: data.number,
        text: data.text,
        question: data.question,
        options: options,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};

(ExamQuestionPage as PageWithLayoutType).layout = Exam;

export default observer(ExamQuestionPage);
