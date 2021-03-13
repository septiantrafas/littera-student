import {
  Box,
  Button,
  Text,
  Grid,
  useColorModeValue as mode,
  Badge,
  Flex,
  Link,
} from "@chakra-ui/react";
import * as React from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";

type IQuestionNavigatorProps = {
  category_id: number;
  question_id: number;
  subquestion_id?: number;
  total_question: number;
};

export const QuestionNavigator = (props: IQuestionNavigatorProps) => {
  const router = useRouter();

  let rows = [];
  for (var i = 0; i < props.total_question; i++) {
    // note: we are adding a key prop here to allow react to uniquely identify each
    // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
    rows.push(
      <NextLink key={i} href={`/exam/${props.category_id}/${i + 1}`}>
        <Button
          type="submit"
          variant={
            i + 1 === Number(router.query.question) ? "solid" : "outline"
          }
          colorScheme={mode("blackAlpha", "gray")}
          boxShadow="none"
          size="md"
          fontSize="md"
          _focus={{
            boxShadow:
              "0 0 1px 2px rgba(113,128,150,.75), 0 1px 1px rgba(0, 0, 0, .15)",
          }}
        >
          {i + 1}
        </Button>
      </NextLink>
    );
  }
  return (
    <>
      <Box>
        <Text fontSize="xl" fontWeight="semibold" color="gray.500" mb="3">
          Question Pallet
        </Text>
        <Grid templateColumns="repeat(6, minmax(0, 1fr))" gap={2}>
          {rows}
        </Grid>
        <Text fontSize="xl" fontWeight="semibold" color="gray.500" mt="6">
          Description
        </Text>
        <Flex alignItems="center" my="2">
          <Badge
            w="20px"
            h="20px"
            fontSize="0.8em"
            colorScheme={mode("blackAlpha", "gray")}
            variant="solid"
            mr="2"
          />
          <Text fontSize="sm" color="gray.500">
            Answered
          </Text>
        </Flex>
        <Flex alignItems="center" my="2">
          <Badge
            w="20px"
            h="20px"
            fontSize="0.8em"
            colorScheme={mode("blackAlpha", "gray")}
            variant="subtle"
            mr="2"
          />
          <Text fontSize="sm" color="gray.500">
            Not Answered
          </Text>
        </Flex>
        <Flex alignItems="center" my="2">
          <Badge
            w="20px"
            h="20px"
            fontSize="0.8em"
            colorScheme={mode("blackAlpha", "gray")}
            variant="outline"
            mr="2"
          />
          <Text fontSize="sm" color="gray.500">
            Not visited
          </Text>
        </Flex>
      </Box>
    </>
  );
};
