import React, { useEffect, useState } from "react";
import Default from "@/layouts/default";
import PageWithLayoutType from "@/types/pageWithLayout";
import { useNavigationStore, useTimeStore } from "providers/RootStoreProvider";
import { Auth } from "@supabase/ui";
import { supabase } from "utils/initSupabase";
import { definitions } from "@/types/supabase";
import { Box, Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const LordIcon = dynamic(() => import("@/components/LordIcon"), {
  ssr: false,
});

interface IAnswerBody {
  id: string;
  schedule_id: number;
  participant_id: number;
  question_id: string;
  value: string;
}

const ThankyouPage: React.FC = () => {
  const router = useRouter();
  const navigationStore = useNavigationStore();
  const timeStore = useTimeStore();
  const { user } = Auth.useUser();

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const isAnySelectedAnswer = navigationStore.ANSWERED_INDEX.length;
    const isFirstEntry = navigationStore.FIRST_ENTRY;

    if (isAnySelectedAnswer && !isFirstEntry) {
      navigationStore.setFirstEntryState(false);
      setLoading(true);

      console.log("SUBMITTING");
      const body: IAnswerBody[] = navigationStore.ANSWERED_INDEX.map((item) => {
        return {
          id: navigationStore.answer_map[item.question_id],
          schedule_id: navigationStore.schedule_id,
          question_id: item.question_id,
          participant_id: navigationStore.participant,
          value: item.option_id.toString(),
        };
      });

      (async () => {
        console.log(body[0]);
        try {
          await supabase.from<definitions["answers"]>("answers").upsert(body, {
            returning: "minimal",
            onConflict: "id",
          });
        } catch (error) {
          console.log("Saving answer error:", error);
        }


        try {
          await supabase.from<definitions["participants"]>("participants")
            .update({ status: "offline" })
            .match({ profile_id: user.id })
        } catch (error) {
          console.log("Update participant status error:", error);
        }

        setLoading(false);
      })();
    }

    (async () => {
      try {
        await navigationStore.clearStore();
        await timeStore.clearStore();
      } catch (error) {
        console.log("Clear storage error:", error)
      }
    })()
  }, [navigationStore, navigationStore.ANSWERED_INDEX, user]);

  return (
    <Box
      d="flex"
      height="90vh"
      width="full"
      justifyContent="center"
      alignItems="center"
    >
      <Box textAlign="center">
        <LordIcon url="/icons/confetti.json" />
        <Text
          maxW="xl"
          fontSize="4xl"
          fontWeight="bold"
          color="blueGray.700"
          lineHeight="10"
        >
          Selamat sudah menyelesaikan rangkaian tes kami
        </Text>

        <Button
          mt="8"
          colorScheme="blue"
          isLoading={isLoading}
          size="sm"
          onClick={() => router.push("/")}
        >
          Kembali ke halaman utama
        </Button>
      </Box>
    </Box>
  );
};

(ThankyouPage as PageWithLayoutType).layout = Default;

export default ThankyouPage;
