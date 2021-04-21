import {
  Box,
  Button,
  Text,
  Grid,
  useColorModeValue as mode,
  Badge,
  Flex,
  Divider,
} from "@chakra-ui/react";
import * as React from "react";
import NextLink from "next/link";
import { useNavigationStore } from "providers/RootStoreProvider";
import { observer } from "mobx-react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { NavigationStore, Paths } from "@/stores/NavigationStore";

function QuestionNavigator(props: { id: string }) {
  const store = useNavigationStore();

  return (
    <>
      <Box h="full">
        <Box height={{ xl: "65%", "2xl": "40%" }} px="10" pt="10">
          <Text
            fontSize="xl"
            fontWeight="semibold"
            color={mode("gray.500", "gray.400")}
            mb="3"
          >
            Question Pallet
          </Text>
          <QuestionGrid store={store} id={props.id} />
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
              borderColor={mode("emerald.400", "emerald.700")}
              bgColor={mode("emerald.50", "emerald.900")}
              borderWidth="1px"
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
              borderColor={mode("yellow.300", "yellow.600")}
              bgColor={mode("yellow.50", "yellow.900")}
              borderWidth="1px"
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
          pb="10"
          height={{ xl: "35%", "2xl": "60%" }}
          w="full"
          alignItems="flex-end"
        >
          <Flex
            w="full"
            alignItems="center"
            borderTopWidth="1px"
            justifyContent="space-between"
            p="3"
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
        </Flex>
      </Box>
    </>
  );
}

type QuestionGridProps = { store: NavigationStore; id: string };

const QuestionGrid = observer((props: QuestionGridProps) => {
  const { store, id } = props;
  return (
    <Grid templateColumns="repeat(4, minmax(0, 1fr))" gap={2}>
      {store.paths.map((path) => {
        const number = path.params.question.number;
        const isVisited = store.VISITED_INDEX.includes(path.params.question.id);
        const isActive = path.params.question.id === id;
        const isAnswered = store.isAnswered(path.params.question.id);

        const route = {
          pathname: "/[package]/[section]/[question]",
          query: {
            package: path.params.package,
            section: path.params.section,
            question: path.params.question.id,
          },
        };

        if (isActive) {
          return (
            <ActiveButton
              key={path.params.question.id}
              path={path}
              route={route}
            />
          );
        } else if (isVisited && !isAnswered) {
          return (
            <VisitedButton
              key={path.params.question.id}
              path={path}
              route={route}
            />
          );
        } else if (isVisited && isAnswered) {
          return (
            <AnsweredButton
              key={path.params.question.id}
              path={path}
              route={route}
            />
          );
        } else {
          return (
            <UnvisitedButton
              key={path.params.question.id}
              path={path}
              route={route}
            />
          );
        }
      })}
    </Grid>
  );
});

type GridButtonProps = {
  path: Paths;
  route: {
    pathname: string;
    query: {
      package: string;
      section: string;
      question: string;
    };
  };
};

const ActiveButton = observer((props: GridButtonProps) => {
  return (
    <NextLink href={props.route}>
      <Button
        _hover={{
          bgColor: mode("indigo.600", "indigo.300"),
        }}
        _active={{
          bgColor: mode("indigo.300", "indigo.300"),
        }}
        bgColor={mode("indigo.500", "indigo.600")}
        color={mode("indigo.50", "indigo.200")}
      >
        {props.path.params.question.number}
      </Button>
    </NextLink>
  );
});

const UnvisitedButton = observer((props: GridButtonProps) => {
  return (
    <NextLink href={props.route}>
      <Button
        opacity={mode("100%", "50%")}
        borderColor={mode("gray.300", "gray.600")}
        variant="outline"
        color={mode("gray.500", "gray.400")}
      >
        {props.path.params.question.number}
      </Button>
    </NextLink>
  );
});

const VisitedButton = observer((props: GridButtonProps) => {
  return (
    <NextLink href={props.route}>
      <Button
        opacity={mode("100%", "50%")}
        variant="outline"
        borderColor={mode("yellow.300", "yellow.600")}
        color={mode("yellow.600", "yellow.300")}
        bgColor={mode("yellow.50", "yellow.900")}
        _hover={{ bgColor: mode("yellow.100", "yellow.700") }}
        _active={{ bgColor: mode("yellow.100", "yellow.700") }}
      >
        {props.path.params.question.number}
      </Button>
    </NextLink>
  );
});

const AnsweredButton = observer((props: GridButtonProps) => {
  return (
    <NextLink href={props.route}>
      <Button
        opacity={mode("100%", "50%")}
        borderColor={mode("emerald.400", "emerald.700")}
        bgColor={mode("emerald.50", "emerald.900")}
        color={mode("emerald.600", "emerald.100")}
        _hover={{ bgColor: mode("emerald.100", "green.700") }}
        _active={{ bgColor: mode("emerald.50", "green.700") }}
        variant="outline"
      >
        {props.path.params.question.number}
      </Button>
    </NextLink>
  );
});

export default observer(QuestionNavigator);
