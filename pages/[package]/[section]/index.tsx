import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticPropsResult } from "next";
import { observer } from "mobx-react-lite";

import Exam from "@/layouts/exam";
import PageWithLayoutType from "@/types/pageWithLayout";
import { Box, Button, Spinner, Text } from "@chakra-ui/react";
import { useNavigationStore, useTimeStore } from "providers/RootStoreProvider";
import { supabase } from "utils/initSupabase";
import timezone from "dayjs/plugin/timezone";
import NextLink from "next/link";
import { Auth } from "@supabase/ui";
import { log, Style } from "utils/consoleLogHelper";

dayjs.extend(timezone);

interface IAnswerBody {
  schedule_id: number;
  profile_id: string;
  question_id: string;
  value: string;
}

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
  const router = useRouter();
  const navigation = useNavigationStore();
  const { user, session } = Auth.useUser();

  const [redirectPath, setRedirectPath] = useState({});

  const start_time = dayjs(props.start_time);
  const end_time = dayjs(props.end_time);
  const duration = end_time.diff(start_time, "minutes");

  useEffect(() => {
    const isAnySelectedAnswer = navigation.ANSWERED_INDEX.length;
    const isFirstEntry = navigation.FIRST_ENTRY;

    log("isAnySelectedAnswer: " + isAnySelectedAnswer);
    log("isFirstEntry: " + isFirstEntry);

    //TODO: CREATE A SUBMIT FEEDBACK SO USER KNOW WHAT'S GOING ON
    if (isAnySelectedAnswer && !isFirstEntry) {
      navigation.setFirstEntryState(false);
      log("SUBMITTING");
      const body: IAnswerBody[] = navigation.ANSWERED_INDEX.map((item) => {
        return {
          schedule_id: navigation.schedule_id,
          profile_id: user.id,
          question_id: item.question_id,
          value: item.option_id.toString(),
        };
      });

      (async () => {
        try {
          const res = await supabase.from("answers").insert(body);

          navigation.clearStore();
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [navigation, navigation.ANSWERED_INDEX, user]);

  useEffect(() => {
    if (!router.isFallback) {
      setRedirectPath({
        pathname: "/[package]/[section]/[question]",
        query: {
          package: navigation.next_path.params.package,
          section: navigation.next_path.params.section,
          question: navigation.next_path.params.question.id,
        },
      });
    }
  }, [router.isFallback, navigation]);

  if (router.isFallback) {
    return (
      <>
        <Spinner size="lg" />
      </>
    );
  }

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
        {/* <Text fontSize="lg" fontWeight="semibold">
          Contoh Soal
        </Text>
        <Text>{props.context}</Text> */}
        <NextLink href={redirectPath} passHref>
          <Button type="button" data-cy="start-button" mt="6">
            Start
          </Button>
        </NextLink>
      </Box>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps = async ({
  params,
}): Promise<GetStaticPropsResult<ISectionProps>> => {
  let data = null;
  let sections = null;
  let path_res = null;

  const query = `
  id,
  number,
  packages:package_id ( id ) 
  )`;

  try {
    path_res = await supabase
      .from<any>("sections")
      .select(query)
      .match({ package_id: params.package })
      .order("number", { ascending: true });

    const res = await supabase
      .from<ISectionResponse>("questions")
      .select("id, number, sections:section_id (*)")
      .match({ section_id: params.section })
      .order("number", { ascending: true })
      .limit(1);

    data = res.data[0];
    sections = data.sections;
  } catch (error) {
    console.error("response error:", error);
    return { notFound: true };
  }

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
  try {
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
      revalidate: 60,
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};

(ExamCategoryPage as PageWithLayoutType).layout = Exam;

export default observer(ExamCategoryPage);
