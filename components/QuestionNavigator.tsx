import {
  Box,
  Button,
  Text,
  Grid,
  useColorModeValue as mode,
  Badge,
  Flex,
} from "@chakra-ui/react";
import * as React from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { useNavigationStore } from "providers/RootStoreProvider";
import { observer } from "mobx-react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { useEffect } from "react";

function QuestionNavigator() {
  const store = useNavigationStore();
  const router = useRouter();

  return (
    <>
      <Box h="full">
        <Box>
          <Text
            fontSize="xl"
            fontWeight="semibold"
            color={mode("gray.500", "gray.400")}
            mb="3"
          >
            Question Pallet
          </Text>
          <QuestionGrid />
          <Text
            fontSize="xl"
            fontWeight="semibold"
            color={mode("gray.500", "gray.400")}
            mt="6"
          >
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
            <Text fontSize="sm" color={mode("gray.500", "gray.400")}>
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
            <Text fontSize="sm" color={mode("gray.500", "gray.400")}>
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
            <Text fontSize="sm" color={mode("gray.500", "gray.400")}>
              Not visited
            </Text>
          </Flex>
        </Box>
        <Flex
          height={{ xl: "40%", "2xl": "60%" }}
          alignItems="flex-end"
          justifyContent="space-between"
        >
          <NextLink
            href={
              store.previous_path
                ? {
                    pathname: "/[package]/[section]/[question]",
                    query: {
                      package: store.previous_path.params.package,
                      section: store.previous_path.params.section,
                      question: store.previous_path.params.question.id,
                    },
                  }
                : ""
            }
          >
            <Button
              variant="link"
              p="2"
              textColor="gray.600"
              leftIcon={<HiArrowLeft />}
              isDisabled={!store.previous_path}
            >
              Back
            </Button>
          </NextLink>

          <NextLink
            href={
              store.next_path
                ? {
                    pathname: "/[package]/[section]/[question]",
                    query: {
                      package: store.next_path.params.package,
                      section: store.next_path.params.section,
                      question: store.next_path.params.question.id,
                    },
                  }
                : ""
            }
          >
            <Button
              variant="link"
              p="2"
              textColor="gray.600"
              rightIcon={<HiArrowRight />}
              isDisabled={!store.next_path}
            >
              Next
            </Button>
          </NextLink>
        </Flex>
      </Box>
    </>
  );
}

function QuestionGrid() {
  const store = useNavigationStore();
  const router = useRouter();
  return (
    <Grid templateColumns="repeat(6, minmax(0, 1fr))" gap={2}>
      {store.paths.map((path, index) => {
        const isActive = path.params.question.id === router.query.question;
        return (
          <NextLink
            key={path.params.question.number}
            href={{
              pathname: "/[package]/[section]/[question]",
              query: {
                package: path.params.package,
                section: path.params.section,
                question: path.params.question.id,
              },
            }}
          >
            <Button
              type="submit"
              variant={isActive ? "solid" : "outline"}
              borderRadius="lg"
              borderColor={
                isActive ? "transparent" : mode("gray.300", "gray.800")
              }
              bgColor={
                store.isVisited(index) && !isActive
                  ? mode("gray.200", "gray.800")
                  : isActive
                  ? mode("blue.600", "blue.800")
                  : "transparent"
              }
              textColor={isActive ? "white" : mode("gray.500", "gray.500")}
              _hover={{
                bgColor: isActive ? "blue.600" : "gray.100",
              }}
              boxShadow="none"
              size="md"
              fontSize="md"
              _focus={{
                boxShadow:
                  "0 0 1px 2px rgba(113,128,150,.75), 0 1px 1px rgba(0, 0, 0, .15)",
              }}
              isDisabled={isActive}
            >
              {path.params.question.number}
            </Button>
          </NextLink>
        );
      })}
    </Grid>
  );
}

export default observer(QuestionNavigator);
