import React, { useEffect, useState } from "react";

import PageWithLayoutType from "@/types/pageWithLayout";
import QuestionNavigator from "@/components/QuestionNavigator";
import Exam from "@/layouts/exam";

import {
  Box,
  Radio,
  RadioGroup,
  useColorModeValue as mode,
  Text,
  Flex,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { observer } from "mobx-react";
import { supabase } from "utils/initSupabase";
import { useNavigationStore, useTimeStore } from "providers/RootStoreProvider";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import ReactHtmlParser from "react-html-parser";
import { useCallback } from "react";

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

const ExamQuestionPage: React.FC = () => {
  const navigation = useNavigationStore();
  const time = useTimeStore();
  const router = useRouter();
  const { isFallback } = useRouter();

  const [isOptionsUseImage, setOptionsUseImage] = useState(false);
  const [data, setData] = useState<IQuestionProps>();

  const fetchQuestion = useCallback(async () => {
    let data = null;
    try {
      const res = await supabase
        .from<IQuestionsResponse>("questions")
        .select("*")
        .match({ id: router.query.question.toString() })
        .single();

      data = res.data;
      const options = JSON.parse(data.options);

      setData({ ...data, options });
      console.log({ options });
    } catch (error) {
      console.error("response error:", error);
      return { notFound: true };
    }
  }, [router.query.question]);

  const fetchPaths = useCallback(async () => {
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
      .match({ section_id: router.query.section.toString() })
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
      (arr) => arr.params.question.id === router.query.question.toString()
    );

    navigation.previous_path = paths[position - 1] ? paths[position - 1] : null;
    navigation.current_path = paths[position];
    navigation.next_path = paths[position + 1] ? paths[position + 1] : null;
    navigation.current_instruction = instruction;
    navigation.paths = paths;
  }, [navigation, router.query.question, router.query.section]);

  useEffect(() => {
    fetchPaths();
    fetchQuestion();
  }, [fetchPaths, fetchQuestion]);

  useEffect(() => {
    navigation.setFirstEntryState(false);
    if (!time.END_TIME) {
      router.push({
        pathname: "/[package]/[section]",
        query: {
          package: router.query.package,
          section: router.query.section,
        },
      });
    }
  }, [time.END_TIME, router, navigation]);

  useEffect(() => {
    if (data) {
      const imageNodeName =
        document.getElementById("htmlRenderer").childNodes[0].childNodes[0]
          .nodeName;
      const isImageExist = imageNodeName.toLowerCase() === "img";

      setOptionsUseImage(isImageExist);
      console.log(imageNodeName);
      console.log(isImageExist);
    }
  }, [data]);

  useEffect(() => {
    if (navigation.paths?.length && data?.id) {
      const position = navigation.paths.findIndex(
        (arr) => arr.params.question.id === data.id
      );

      const id = navigation.paths[position].params.question.id;
      navigation.addToVisitedIndex(id);
    }
  }, [navigation.paths, data?.id, navigation]);

  // TODO: REFACTOR THIS TO COMPONENT BASED
  return (
    <>
      {data && (
        <Flex height="95vh" bg={mode("white", "gray.800")}>
          <QuestionNavigator id={data.id} />

          {!!data.text && (
            <Box w="50%" px="10" py="12" overflow="scroll">
              <Text className="options-with-image">
                {ReactHtmlParser(data.text)}
              </Text>
            </Box>
          )}

          <Box
            w={isOptionsUseImage ? "100%" : "50%"}
            mx="auto"
            px="10"
            justifyContent="space-between"
            overflowY="scroll"
          >
            <Box
              maxW={
                isOptionsUseImage || !data.text
                  ? "full"
                  : { xl: "2xl", "2xl": "3xl" }
              }
              mx="auto"
              my="12"
            >
              <Text
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                className="options-with-image"
              >
                {data.text && ReactHtmlParser(data.question)}
                {(isOptionsUseImage || !data.text) &&
                  ReactHtmlParser(data.question)}
              </Text>

              <RadioGroup
                onChange={(nextValue) =>
                  navigation.setAnsweredIndex({
                    question_id: data.id,
                    option_id: parseFloat(nextValue),
                  })
                }
                value={navigation.getSelectedOption(data.id)}
                mt="6"
              >
                <Flex w="full" direction={isOptionsUseImage ? "row" : "column"}>
                  {data.options.length &&
                    data.options?.map((item: any, index: any) => {
                      const number = index + 1;
                      const isItemSelected =
                        navigation.getSelectedOption(data.id) === number;

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
                          fontWeight={isItemSelected ? "medium" : "base"}
                          boxShadow={isItemSelected ? "outline" : "sm"}
                          textColor={
                            isItemSelected
                              ? mode("blue.200", "blue.400")
                              : mode("gray.200", "gray.400")
                          }
                          _hover={{
                            boxShadow: isItemSelected ? "outline" : "base",
                            transform: "translateY(-2px)",
                            textColor: isItemSelected ? "blue.500" : "gray.500",
                          }}
                          borderColor={
                            isItemSelected
                              ? "blue.600"
                              : mode("gray.200", "gray.700")
                          }
                          style={{
                            WebkitTransition:
                              "box-shadow 250ms, transform 200ms",
                            transition: "box-shadow 250ms, transform 200ms",
                          }}
                          onClick={() =>
                            navigation.setAnsweredIndex({
                              question_id: data.id,
                              option_id: number,
                            })
                          }
                        >
                          <Text
                            fontSize="3xl"
                            fontWeight="bold"
                            cursor="pointer"
                            my="auto"
                            mr="6"
                            textTransform="uppercase"
                          >
                            {String.fromCharCode("a".charCodeAt(0) + index)}
                          </Text>

                          <Radio
                            my="4"
                            display="flex"
                            value={number}
                            cursor="pointer"
                            size="md"
                            onClick={() =>
                              navigation.setAnsweredIndex({
                                question_id: data.id,
                                option_id: number,
                              })
                            }
                            hidden
                          >
                            <Box
                              id="htmlRenderer"
                              className="options-with-image"
                              cursor="pointer"
                              color={
                                isItemSelected
                                  ? mode("blue.800", "gray.200")
                                  : mode("gray.800", "gray.200")
                              }
                            >
                              {ReactHtmlParser(item.value)}
                            </Box>
                          </Radio>
                        </Box>
                      );
                    })}
                </Flex>
              </RadioGroup>
            </Box>

            <Flex my="8" w="full" alignItems="flex-end">
              <Flex w="full" alignItems="center" justifyContent="space-between">
                <NextLink
                  href={
                    navigation.previous_path
                      ? {
                        pathname: "/[package]/[section]/[question]",
                        query: {
                          package: navigation.previous_path.params.package,
                          section: navigation.previous_path.params.section,
                          question:
                            navigation.previous_path.params.question.id,
                        },
                      }
                      : ""
                  }
                >
                  <Button
                    variant="ghost"
                    textColor="gray.600"
                    leftIcon={<HiChevronLeft />}
                    isDisabled={!navigation.previous_path}
                  >
                    Kembali
                  </Button>
                </NextLink>

                <NextLink
                  href={
                    navigation.next_path
                      ? {
                        pathname: "/[package]/[section]/[question]",
                        query: {
                          package: navigation.next_path.params.package,
                          section: navigation.next_path.params.section,
                          question: navigation.next_path.params.question.id,
                        },
                      }
                      : ""
                  }
                >
                  <Button
                    variant="ghost"
                    textColor="gray.600"
                    rightIcon={<HiChevronRight />}
                    isDisabled={!navigation.next_path}
                  >
                    Lanjut
                  </Button>
                </NextLink>
              </Flex>
            </Flex>
          </Box>
        </Flex>
      )}
    </>
  );
};

(ExamQuestionPage as PageWithLayoutType).layout = Exam;

export default observer(ExamQuestionPage);
