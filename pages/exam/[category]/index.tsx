import { GetStaticPaths } from "next";
// import Image from "next/image";
import React from "react";
import PageWithLayoutType from "@/types/pageWithLayout";

import Exam from "@/layouts/exam";
import { Box, Text } from "@chakra-ui/react";
import { HiOutlineVideoCamera, HiOutlineMicrophone } from "react-icons/hi";

type ICategoryUrl = {
  category: string;
};

type ICategoryProps = {
  total_question_count: string;
  total_easy_question_count: string;
  total_medium_question_count: string;
  total_hard_question_count: string;
};

const ExamCategoryPage = (props: ICategoryProps) => {
  return (
    <>
      <p>{props.total_question_count}</p>
      <p>{props.total_easy_question_count}</p>
      <p>{props.total_medium_question_count}</p>
      <p>{props.total_hard_question_count}</p>
    </>
  );
};

export const getStaticPaths: GetStaticPaths<ICategoryUrl> = async () => {
  // Call an external API endpoint to get posts
  const res = await fetch("https://opentdb.com/api_category.php");
  const categories = await res.json();

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return {
    paths: categories.trivia_categories.map((category) => ({
      params: {
        category: category.id.toString(),
      },
    })),
    fallback: false,
  };
};

export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /question/1, then params.id is 1
  const res = await fetch(
    `https://opentdb.com/api_count.php?category=${params.category}`
  );
  const data = await res.json();
  const results = data.category_question_count;

  // Pass data to the page via props
  return {
    props: {
      total_question_count: results.total_question_count,
      total_easy_question_count: results.total_easy_question_count,
      total_medium_question_count: results.total_medium_question_count,
      total_hard_question_count: results.total_hard_question_count,
    },
  };
}

(ExamCategoryPage as PageWithLayoutType).layout = Exam;

export default ExamCategoryPage;
