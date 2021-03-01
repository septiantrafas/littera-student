import { GetServerSideProps } from "next";
// import Image from "next/image";

import React from "react";
import PageWithLayoutType from "@/types/pageWithLayout";

import Exam from "@/layouts/exam";
import { Box, Text } from "@chakra-ui/react";
import { HiOutlineVideoCamera, HiOutlineMicrophone } from "react-icons/hi";

type IQuestionUrl = {
  question: string;
};

type IQuestionProps = {
  difficulty: string;
  question: string;
};

const ExamQuestionPage = (props: IQuestionProps) => {
  return (
    <>
      <p>{props.difficulty}</p>
      <p>{props.question}</p>
    </>
  );
};

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch data from external API
  const res = await fetch(
    `https://opentdb.com/api.php?amount=20&category=${context.params.category}&type=multiple`
  );
  const data = await res.json();
  const results = data.results[Number(context.params.question)];

  // Pass data to the page via props
  return {
    props: {
      difficulty: results.difficulty,
      question: results.question,
    },
  };
};

(ExamQuestionPage as PageWithLayoutType).layout = Exam;

export default ExamQuestionPage;
