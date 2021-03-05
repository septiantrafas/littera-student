import { GetStaticPaths } from "next";
// import Image from "next/image";
import React from "react";
import PageWithLayoutType from "@/types/pageWithLayout";

import Exam from "@/layouts/exam";
import { Box, Button, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
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
  const start_time = dayjs(props.start_time);
  const end_time = dayjs(props.end_time);
  const duration = end_time.diff(start_time, "minutes");

  return (
    <>
      <Box my="8">
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          {props.title}
        </Text>
        <Text fontSize="lg" textAlign="center">
          Total Waktu {duration} Menit
        </Text>
      </Box>
      <Box mx="20" mb="6">
        <Text fontSize="lg" fontWeight="semibold">
          Instruksi
        </Text>
        <Text>{props.description}</Text>
      </Box>
      <Box mx="20" mb="6">
        <Text fontSize="lg" fontWeight="semibold">
          Contoh Soal
        </Text>
        <Text>{props.description}</Text>
      </Box>
    </>
  );
};

export const getStaticPaths: GetStaticPaths<ICategoryUrl> = async () => {
  // Call an external API endpoint to get posts
  const res = await fetch("http://localhost:3001/categories");
  const categories = await res.json();

  const paths = categories.map((category) => ({
    params: {
      category: category.id.toString(),
    },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return {
    paths,
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
