import dayjs from "dayjs";
import React from "react";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticPropsResult } from "next";
import { observer } from "mobx-react-lite";

import Exam from "@/layouts/exam";
import PageWithLayoutType from "@/types/pageWithLayout";
import { Box, Button, Text } from "@chakra-ui/react";
import { useTimeStore } from "providers/RootStoreProvider";
import { supabase } from "utils/initSupabase";

type IStaticPath = {
  id: number;
  packages: { id: number };
};

type ISectionResponse = {
  id: number;
  package_id: number;
  number: number;
  titles: string;
  context: string;
  start_time: string;
  end_time: string;
};

type ISectionUrl = {
  section: string;
};

type ISectionProps = {
  id: number;
  package_id: number;
  number: number;
  title: string;
  context: string;
  start_time: string;
  end_time: string;
};

const ExamCategoryPage = (props: ISectionProps) => {
  const store = useTimeStore();
  const router = useRouter();

  const start_time = dayjs(props.start_time);
  const end_time = dayjs(props.end_time);
  const duration = end_time.diff(start_time, "minutes");

  store.updateEndTime(end_time.toString());

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
        <Text>{props.context}</Text>
      </Box>
      <Box mx="20" mb="6">
        <Text fontSize="lg" fontWeight="semibold">
          Contoh Soal
        </Text>
        <Text>{props.context}</Text>
        {/* <Button
          mt="6"
          onClick={() =>
            router.push({
              pathname: "/[package]/[section]/[question]",
              query: { category: router.query.section, question: 1 },
            })
          }
        >
          Start
        </Button> */}
      </Box>
    </>
  );
};

export const getStaticPaths: GetStaticPaths<ISectionUrl> = async () => {
  // const routes = await generateRoutes();
  // console.log(routes);
  const query = `
    id,
    packages:package_id ( id ) 
  )
  `;

  const res = await supabase.from<IStaticPath>("sections").select(query);
  const paths = res.data.map((section) => ({
    params: {
      package: section.packages.id.toString(),
      section: section.id.toString(),
    },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({
  params,
}): Promise<GetStaticPropsResult<ISectionProps>> => {
  const res = await supabase
    .from<ISectionResponse>("sections")
    .select("*")
    .match({ id: params.section })
    .single();
  const data = res.data;

  // Pass data to the page via props
  return {
    props: {
      id: data.id,
      package_id: data.package_id,
      number: data.number,
      title: data.titles,
      context: data.context,
      start_time: data.start_time,
      end_time: data.end_time,
    },
  };
};

(ExamCategoryPage as PageWithLayoutType).layout = Exam;

export default observer(ExamCategoryPage);
