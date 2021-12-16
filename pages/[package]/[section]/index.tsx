import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticPropsResult } from "next";
import { observer } from "mobx-react-lite";

// import Exam from "@/layouts/exam";
import Default from "@/layouts/default";
import PageWithLayoutType from "@/types/pageWithLayout";
import { Box, Button, Spinner, Text } from "@chakra-ui/react";
import { useNavigationStore, useTimeStore } from "providers/RootStoreProvider";
import { supabase } from "utils/initSupabase";
import timezone from "dayjs/plugin/timezone";
import NextLink from "next/link";
import { Auth } from "@supabase/ui";
import { log, Style } from "utils/consoleLogHelper";
import { definitions } from "@/types/supabase";
import ReactHtmlParser from "react-html-parser";

dayjs.extend(timezone);

interface IAnswerBody {
  id: string;
  schedule_id: number;
  participant_id: number;
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

type ISectionPageData = {
  id: string;
  number: number;
  titles: string;
  context: string;
  start_time: string;
  end_time: string;
};

const isDevelopment = process.env.NEXT_PUBLIC_ENVIRONMENT === "development";

const ExamCategoryPage: React.FC = () => {
  const timeStore = useTimeStore();
  const router = useRouter();
  const navigationStore = useNavigationStore();
  const { user, session } = Auth.useUser();

  const [redirectPath, setRedirectPath] = useState({});
  const [data, setData] = useState<ISectionPageData>();
  const [duration, setDuration] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPaths = useCallback(async () => {
    let data = null;
    let sections = null;
    let path_res = null;

    const query = `
      id,
      number,
      packages:package_id ( id ) 
    )`;

    if (Object.keys(router.query).length) {
      const params = router.query;
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

      const next_section = paths[position + 1]
        ? paths[position + 1].params
        : null;

      const next_section_url = next_section
        ? {
          package: next_section.package,
          section: next_section.section,
        }
        : {
          package: params.package,
          section: null,
        };

      const next_path = {
        params: {
          package: params.package.toString(),
          section: params.section.toString(),
          question: {
            id: data.id,
            number: data.number,
          },
        },
      };

      const time = dayjs().toISOString();
      const startTime = dayjs(sections.start_time);
      const endTime = dayjs(sections.end_time);
      const duration = endTime.diff(startTime, "minutes");

      console.log("section_time", time);
      const timeLeft = timeStore.calculateTimeLeft(timeStore.TIME);

      if (!navigationStore.NEXT_PATH) { // if there's no next question
        if (isDevelopment) {
          timeStore.updateStartTime(
            dayjs().subtract(1, "minute").toISOString()
          );

          if (timeStore.TIME_LEFT <= 0 || !timeStore.TIME_LEFT) {
            timeStore.updateEndTime(dayjs().add(5, "minutes").toISOString());
          } else {
            timeStore.updateEndTime(dayjs().add(timeStore.TIME_LEFT, "seconds").toISOString());
          }

          timeStore.updateTimeoutPath(next_section_url);
          timeStore.updateTime(time);
        } else {
          timeStore.updateStartTime(startTime.toISOString());
          timeStore.updateEndTime(endTime.toISOString());
          timeStore.updateTimeoutPath(next_section_url);
          timeStore.updateTime(time);
        }
      }

      navigationStore.next_path = next_path;

      setDuration(duration);
      setData(sections);
    }
  }, [navigationStore, router.query, timeStore]);

  useEffect(() => {
    fetchPaths();
  }, [fetchPaths]);

  useEffect(() => {
    const isAnySelectedAnswer = navigationStore.ANSWERED_INDEX.length;
    const isFirstEntry = navigationStore.FIRST_ENTRY;

    //TODO: CREATE A SUBMIT FEEDBACK SO USER KNOW WHAT'S GOING ON
    if (isAnySelectedAnswer && !isFirstEntry) {
      setLoading(true)
      navigationStore.setFirstEntryState(false);
      console.log("SUBMITTING");
      const body: IAnswerBody[] = navigationStore.ANSWERED_INDEX.map((item) => {
        return {
          id: navigationStore.answer_map[item.question_id],
          schedule_id: navigationStore.schedule_id,
          participant_id: navigationStore.participant,
          question_id: item.question_id,
          value: item.option_id.toString(),
        };
      });

      (async () => {
        console.log(body[0]);
        try {
          const res = await supabase
            .from<definitions["answers"]>("answers")
            .upsert(body, {
              returning: "minimal",
              onConflict: "id",
            });

          setLoading(false)
          if (res) navigationStore.clearStore();
        } catch (error) {
          setLoading(false)
          console.log(error);
        }
      })();
    }
  }, [navigationStore, navigationStore.ANSWERED_INDEX, user]);

  useEffect(() => {
    console.log(navigationStore.next_path);
    if (navigationStore.next_path) {
      setRedirectPath({
        pathname: "/[package]/[section]/[question]",
        query: {
          package: navigationStore.next_path.params.package,
          section: navigationStore.next_path.params.section,
          question: navigationStore.next_path.params.question.id,
        },
      });
    }
  }, [navigationStore.next_path]);

  return (
    <>
      {!data && (
        <Box
          display="flex"
          w="full"
          h="100vh"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="lg" />
        </Box>
      )}
      {data && (
        <>
          <Box my="8">
            <Text
              textTransform="uppercase"
              fontWeight="bold"
              textAlign="center"
              textColor="gray.500"
            >
              Bagian {data.number}
            </Text>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center">
              {data.titles}
            </Text>
            <Text fontSize="sm" textAlign="center">
              Total Waktu {duration} Menit
            </Text>
          </Box>
          <Box mx="20" mb="6">
            <Text fontSize="lg" fontWeight="semibold">
              Instruksi
            </Text>
            <Text>
              {ReactHtmlParser(data.context)}
            </Text>
          </Box>
          <Box mx="20" mb="6">
            <NextLink href={redirectPath} prefetch={true} passHref>
              <Button isLoading={loading} type="button" data-cy="start-button" mt="6">
                {loading ? "Menyimpan" : "Mulai"}
              </Button>
            </NextLink>
          </Box>
        </>
      )}
    </>
  );
};

(ExamCategoryPage as PageWithLayoutType).layout = Default;

export default observer(ExamCategoryPage);
