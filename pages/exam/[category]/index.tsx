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
  title: string;
  description: string;
  start_time: string;
  end_time: string;
};

const ExamCategoryPage = (props: ICategoryProps) => {
  return (
    <>
      <p>{props.title}</p>
      <p>{props.description}</p>
      <p>{props.start_time}</p>
      <p>{props.end_time}</p>
    </>
  );
};

export const getStaticPaths: GetStaticPaths<ICategoryUrl> = async () => {
  // Call an external API endpoint to get posts
  const res = await fetch("http://localhost:3001/categories");
  const categories = await res.json();

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return {
    paths: categories.map((category) => ({
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
    `http://localhost:3001/categories/${params.category}`
  );
  const data = await res.json();

  // Pass data to the page via props
  return {
    props: {
      title: data.title,
      description: data.description,
      start_time: data.start_time,
      end_time: data.end_time,
    },
  };
}

(ExamCategoryPage as PageWithLayoutType).layout = Exam;

export default ExamCategoryPage;
