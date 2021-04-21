import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticPropsResult } from "next";
import { observer } from "mobx-react-lite";

import Exam from "@/layouts/exam";
import PageWithLayoutType from "@/types/pageWithLayout";
import { Box, Button, Text } from "@chakra-ui/react";
import { useNavigationStore, useTimeStore } from "providers/RootStoreProvider";
import { supabase } from "utils/initSupabase";
import timezone from "dayjs/plugin/timezone";
import NextLink from "next/link";

dayjs.extend(timezone);

type IStaticPath = {
  id: string;
  packages: { id: string };
};

type ISectionsPath = {
  id: string;
  sections: {
    id: string;
    number: number;
    packages: {
      id: string;
    };
  };
};

type ISectionResponse = {
  id: string;
  number: number;
  sections: {
    id: string;
    number: number;
    titles: string;
    context: string;
    start_time: string;
    end_time: string;
  };
};

type ISectionUrl = {
  section: string;
};

type ISectionProps = {
  hydrationData: {
    navigationStore: {
      next_path;
    };
    timeStore: {
      time: string;
      start_time: string;
      end_time: string;
    };
  };
  id: string;
  number: number;
  title: string;
  context: string;
  start_time: string;
  end_time: string;
};

const ExamCategoryPage = (props: ISectionProps) => {
  const store = useTimeStore();
  const navigation = useNavigationStore();
  const router = useRouter();

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
        <Text>{props.context}</Text>
      </Box>
      <Box mx="20" mb="6">
        <Text fontSize="lg" fontWeight="semibold">
          Contoh Soal
        </Text>
        <Text>{props.context}</Text>
        <NextLink
          href={{
            pathname: "/[package]/[section]/[question]",
            query: {
              package: navigation.next_path.params.package,
              section: navigation.next_path.params.section,
              question: navigation.next_path.params.question.id,
            },
          }}
        >
          <Button data-cy="start-button" mt="6">
            Start
          </Button>
        </NextLink>
      </Box>
    </>
  );
};

export const getStaticPaths: GetStaticPaths<ISectionUrl> = async () => {
  const query = `
    id,
    packages:package_id ( id ) 
  )
  `;

  const res = await supabase.from<IStaticPath>("sections").select(query);
  const paths = res.data.map((section) => ({
    params: {
      package: section.packages.id,
      section: section.id,
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
  const query = `
  id,
  number,
  packages:package_id ( id ) 
  )`;

  const path_res = await supabase
    .from<any>("sections")
    .select(query)
    .match({ package_id: params.package })
    .order("number", { ascending: true });

  const paths = path_res.data.map((data) => ({
    params: {
      package: data.packages.id.toString(),
      section: data.id.toString(),
    },
  }));

  const position = paths.findIndex(
    (arr) => arr.params.section === params.section
  );

  const next_section = paths[position + 1] ? paths[position + 1].params : null;
  const next_section_url = next_section
    ? {
        package: next_section.package,
        section: next_section.section,
      }
    : {
        package: params.package,
        section: "lobby",
      };

  const res = await supabase
    .from<ISectionResponse>("questions")
    .select("id, number, sections:section_id (*)")
    .match({ section_id: params.section })
    .order("number", { ascending: true })
    .limit(1);

  const data = res.data[0];
  const sections = data.sections;

  const next_path = {
    params: {
      package: params.package,
      section: params.section,
      question: {
        id: data.id,
        number: data.number,
      },
    },
  };

  const time = dayjs().tz("Asia/Jakarta").toISOString();

  const hydrationData = {
    navigationStore: {
      next_path,
    },
    timeStore: {
      time,
      start_time: sections.start_time,
      end_time: sections.end_time,
      timeout_path: next_section_url,
    },
  };
  // Pass data to the page via props
  return {
    props: {
      hydrationData,
      id: sections.id,
      number: sections.number,
      title: sections.titles,
      context: sections.context,
      start_time: sections.start_time,
      end_time: sections.end_time,
    },
  };
};

(ExamCategoryPage as PageWithLayoutType).layout = Exam;

export default observer(ExamCategoryPage);
