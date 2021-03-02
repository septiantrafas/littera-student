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
  answer: string[];
  question: string;
};

const ExamQuestionPage = (props: IQuestionProps) => {
  return (
    <>
      <p>{props.question}</p>
      <ul>
        {props.answer.map((item, index) => (
          <li key="{item}">
            {index + 1} {item}
          </li>
        ))}
      </ul>
    </>
  );
};

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch data from external API
  const res = await fetch(
    `http://localhost:3001/categories/${context.params.category}?_embed=questions`
  );
  const data = await res.json();
  const results = data.questions[Number(context.params.question)];

  // Pass data to the page via props
  return {
    props: {
      answer: results.answer,
      question: results.question,
    },
  };
};

(ExamQuestionPage as PageWithLayoutType).layout = Exam;

export default ExamQuestionPage;
